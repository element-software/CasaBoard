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
      limit: 5 
    });
    const trialSub = existingSubs.data.find(s => 
      s.status === 'trialing' && 
      s.metadata?.origin === 'auto-free-trial'
    );

    if (trialSub) {
      // Update existing trial subscription to paid
      serverLogger.info('stripe:checkout', 'Updating existing trial subscription', trialSub.id);
      
      // Update subscription items to new price
      await stripe.subscriptions.update(trialSub.id, {
        items: [{
          id: trialSub.items.data[0].id,
          price: price,
        }],
        metadata: { 
          user_id: user.id, 
          plan_id: plan, 
          interval,
          origin: 'upgraded-from-trial'
        },
        // Remove trial settings to make it paid immediately
        trial_settings: undefined,
      });

      // Clean up any local entitlements cache since we're now using Stripe-only
      try {
        await supabase
          .from("user_entitlements")
          .delete()
          .eq("user_id", user.id);
        serverLogger.info('stripe:checkout', 'Cleaned up local entitlements cache');
      } catch (err) {
        serverLogger.warn('stripe:checkout', 'Failed to clean up local entitlements', err);
      }

      serverLogger.info('stripe:checkout', 'Successfully updated trial subscription to paid');
      const origin = req.headers.get("origin") || new URL(req.url).origin;
      return NextResponse.redirect(`${origin}/auth/profile/billing/success?upgraded=true`, { status: 303 });
    }

    // No existing trial subscription, create new checkout session
    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Prefer binding to an existing customer for reliable webhooks → user mapping
      customer: existingCustomerId ?? undefined,
      customer_email: existingCustomerId ? undefined : (user.email ?? undefined),
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing?canceled=true`,
      // Attach metadata to the Checkout Session AND the Subscription that will be created
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan_id: plan, interval },
      subscription_data: {
        metadata: { user_id: user.id, plan_id: plan, interval },
      },
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error) {
    serverLogger.error('stripe:checkout', 'Checkout init failed', error);
    return NextResponse.json({ error: "Checkout init failed" }, { status: 500 });
  }
}
