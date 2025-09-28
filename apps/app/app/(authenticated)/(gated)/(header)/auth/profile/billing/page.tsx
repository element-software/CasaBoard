import { SubscriptionService, StripeService, SupabaseServer, serverLogger } from "@repo/lib";
import BillingContent from "./BillingContent";

export default async function BillingPage() {
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();
  const subscription = await SubscriptionService.getCurrentSubscriptionSummary();
  let cancelAt: string | null = null;
  
  // Fetch cancellation date if needed
  try {
    const supabase = await SupabaseServer.createClient();
    const { data: userRow } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .limit(1)
      .single();
    const customerId = userRow?.stripe_customer_id as string | undefined;
    if (customerId) {
      const stripe = StripeService.getStripe();
      const subs = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 1,
      });
      const sub: any = subs.data[0] as any;
      const ca = sub?.cancel_at;
      if (typeof ca === "number")
        cancelAt = new Date(ca * 1000).toISOString();
    }
  } catch {}

  serverLogger.info(
    "billing:page",
    "subscription",
    subscription,
    "cancelAt",
    cancelAt
  );
  return (
    <BillingContent
      entitlements={entitlements}
      currentPeriodEnd={subscription.currentPeriodEnd ?? null}
      cancelAt={cancelAt}
      planLabel={subscription.planLabel ?? null}
    />
  );
}
