import { NextRequest, NextResponse } from "next/server";
import { SupabaseServer, StripeService } from "@repo/lib";
import { serverLogger } from "@repo/lib";

// Ensure Node runtime so we can access the raw request body for Stripe signature verification
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Important: use raw body (req.text) before any parsing
  serverLogger.info('stripe:webhook', 'event received');
  const stripe = StripeService.getStripe();
  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!whSecret || !sig)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  serverLogger.info('stripe:webhook', 'event type', event.type);

  const supabase = await SupabaseServer.createClient();
  switch (event.type) {
    case "entitlements.active_entitlement_summary.updated":
      // No-op: entitlement checks read directly from Stripe now
      break;
    case "checkout.session.completed": {
      serverLogger.info('stripe:webhook', 'event.type: checkout.session.completed');
      const session: any = event.data.object;
      const userId =
        session?.metadata?.user_id || session?.client_reference_id || null;
      const planId = session?.metadata?.plan_id;
      const stripeCustomerId: string | null = session?.customer ?? null;
      serverLogger.info(
        "[stripe:webhook] userId",
        userId,
        "planId",
        planId,
        "stripeCustomerId",
        stripeCustomerId
      );
      if (userId && planId) {
        serverLogger.info('stripe:webhook', 'inserting subscription');
        await supabase.from("subscriptions").insert({
          user_id: userId,
          plan_id: planId,
          status: "active",
          current_period_end: new Date().toISOString(),
        });
        if (stripeCustomerId) {
          serverLogger.info('stripe:webhook', 'inserting billing customer');
          await supabase
            .from("billing_customers")
            .upsert(
              { user_id: userId, stripe_customer_id: stripeCustomerId },
              { onConflict: "user_id" }
            );
        } else {
          serverLogger.info('stripe:webhook', 'no stripe customer ID found');
        }
      } else {
        serverLogger.info('stripe:webhook', 'no user ID or plan ID found');
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted": {
      serverLogger.info(
        "stripe:webhook",
        "event.type: customer.subscription.updated, customer.subscription.created, customer.subscription.deleted"
      );
      const sub: any = event.data.object;
      let userId: string | null = sub?.metadata?.user_id || null;
      serverLogger.info('stripe:webhook', 'userId', userId, "customer", sub?.customer);
      if (!userId && sub?.customer) {
        serverLogger.info(
          "stripe:webhook",
          "No user ID found, looking up by stripe customer ID"
        );
        const { data: map } = await supabase
          .from("billing_customers")
          .select("user_id")
          .eq("stripe_customer_id", sub.customer as string)
          .single();
        userId = map?.user_id ?? null;
          serverLogger.info('stripe:webhook', 'Found user ID', userId);
      }
      if (userId) {
        serverLogger.info(
          "stripe:webhook",
          "event.type: customer.subscription.updated, customer.subscription.created, customer.subscription.deleted, Updating subscription"
        );
        const periodEndIso =
          typeof sub?.current_period_end === "number"
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null;
        await supabase.from("subscriptions").insert({
          user_id: userId,
          plan_id:
            sub.items?.data?.[0]?.price?.nickname ??
            sub.metadata?.plan_id ??
            "starter",
          status: sub.status,
          current_period_end: periodEndIso,
        });
        // No local user_entitlements cache anymore
      } else {
        serverLogger.info(
          "stripe:webhook",
          "event.type: customer.subscription.updated, customer.subscription.created, customer.subscription.deleted, No user ID found when updating subscription"
        );
      }
      break;
    }
    // Stripe uses `customer.subscription.deleted` for immediate cancellations
    // and `customer.subscription.updated` with status changes for cancel_at_period_end
    // The deleted case is already handled above; no separate case needed.
    // Leaving a placeholder comment for clarity.
    default:
      break;
  }
  return NextResponse.json({ received: true });
}
