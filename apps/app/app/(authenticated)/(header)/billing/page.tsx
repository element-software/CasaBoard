import { SubscriptionService } from "@repo/lib";
import { StripeService, SupabaseServer } from "@repo/lib";
import BillingContent from "./BillingContent";

export default async function BillingPage() {
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();
  let currentPeriodEnd: string | null = null;
  if (entitlements.active) {
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
        const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 1 });
        const sub: any = subs.data[0] as any;
        const cpe = sub?.current_period_end;
        if (typeof cpe === "number") currentPeriodEnd = new Date(cpe * 1000).toISOString();
      }
    } catch {}
  }
  return <BillingContent entitlements={entitlements} currentPeriodEnd={currentPeriodEnd} />;
}
