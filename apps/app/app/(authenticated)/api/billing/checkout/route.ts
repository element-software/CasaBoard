import { NextRequest, NextResponse } from "next/server";
import { StripeService, SubscriptionService, SupabaseServer, getCurrentAuthUser } from "@repo/lib";
import { serverLogger } from "@repo/lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan");
    const interval = (searchParams.get("interval") as "monthly" | "yearly" | null) || "monthly";
    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }
    const supabase = await SupabaseServer.createClient();
    const user = await getCurrentAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stripe = StripeService.getStripe();
    const price = await StripeService.getCheckoutPriceForPlan(plan as any, interval);
    let existingCustomerId = await SubscriptionService.getStripeCustomerIdForCurrentUser();

    // Ensure Stripe customer exists and map into billing_customers via user-scoped insert (RLS allowed)
    if (!existingCustomerId) {
      serverLogger.info('stripe:checkout', 'No existing customer ID found, creating one');
      const list = await stripe.customers.list({ email: user.email ?? undefined, limit: 1 });
      existingCustomerId = list.data[0]?.id ?? null;
      serverLogger.info('stripe:checkout', 'Existing customer ID found', existingCustomerId);
      if (!existingCustomerId) {
        const created = await stripe.customers.create({ email: user.email ?? undefined, metadata: { user_id: user.id } });
        existingCustomerId = created.id;
        serverLogger.info('stripe:checkout', 'Created new customer ID', existingCustomerId);
      }
      await supabase
        .from("billing_customers")
        .upsert({ user_id: user.id, stripe_customer_id: existingCustomerId }, { onConflict: "user_id" })
        .throwOnError();
      serverLogger.info('stripe:checkout', 'Inserted new customer ID into billing_customers');
    }

    // Check if user has an existing trial subscription that we should update instead of creating new
    const existingSubs = await stripe.subscriptions.list({ 
      customer: existingCustomerId, 
      status: 'all', 
      limit: 10 
    });
    
    // Look for trial subscription with auto-free-trial origin, regardless of current status
    const trialSub = existingSubs.data.find(s => 
      s.metadata?.origin === 'auto-free-trial' &&
      ['trialing', 'active', 'past_due', 'unpaid'].includes(s.status)
    );
    
    serverLogger.info('stripe:checkout', 'Found existing subscriptions', {
      count: existingSubs.data.length,
      subs: existingSubs.data.map(s => ({
        id: s.id,
        status: s.status,
        origin: s.metadata?.origin,
        trial_end: s.trial_end
      })),
      trialSub: trialSub ? { id: trialSub.id, status: trialSub.status } : null
    });

    if (trialSub) {
      // For trial users, create a checkout session that will update the existing subscription
      serverLogger.info('stripe:checkout', 'Creating checkout session for trial upgrade', {
        trialSubId: trialSub.id,
        status: trialSub.status,
        requestedPlan: plan
      });
      
      const origin = req.headers.get("origin") || new URL(req.url).origin;

      // end the trial
      const updatedTrialSub = await stripe.subscriptions.update(trialSub.id, {
        trial_end: 'now',
        items: [{ price, quantity: 1 }],
        proration_behavior: 'none',
      });

      // get the latest invoice ID
      const latestInvoice = updatedTrialSub.latest_invoice

      // create the checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: existingCustomerId,
        line_items: [{ price, quantity: 1 }],
        success_url: `${origin}/auth/profile/billing/success?session_id={CHECKOUT_SESSION_ID}&upgraded=true`,
        cancel_url: `${origin}/auth/profile/billing?canceled=true`,
        client_reference_id: user.id,
        metadata: { 
          user_id: user.id, 
          plan_id: plan, 
          interval, 
          origin: 'trial-upgrade',
          existing_subscription_id: trialSub.id
        },
        subscription_data: {
          metadata: { 
            user_id: user.id, 
            plan_id: plan, 
            interval, 
            origin: 'trial-upgrade',
            existing_subscription_id: trialSub.id,
          },
        },
      });
      
      return NextResponse.redirect(session.url!, { status: 303 });
    }

    // No existing trial subscription, create new checkout session
    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Prefer binding to an existing customer for reliable webhooks → user mapping
      customer: existingCustomerId ?? undefined,
      customer_email: existingCustomerId ? undefined : (user.email ?? undefined),
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/auth/profile/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/auth/profile/billing?canceled=true`,
      // Attach metadata to the Checkout Session AND the Subscription that will be created
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan_id: plan, interval, origin: 'auto-free-trial' },
      subscription_data: {
        metadata: { user_id: user.id, plan_id: plan, interval, origin: 'auto-free-trial' },
      },
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error) {
    serverLogger.error('stripe:checkout', 'Checkout init failed', error);
    return NextResponse.json({ error: "Checkout init failed", details: error }, { status: 500 });
  }
}
