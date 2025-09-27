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
        trial_period_days: 30,
      },
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (error) {
    serverLogger.error('stripe:checkout', 'Checkout init failed', error);
    return NextResponse.json({ error: "Checkout init failed" }, { status: 500 });
  }
}
