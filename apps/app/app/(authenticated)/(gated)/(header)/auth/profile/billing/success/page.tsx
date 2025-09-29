import { redirect } from "next/navigation";
import { SubscriptionService, StripeService, SupabaseServer, serverLogger } from "@repo/lib";
import SuccessContent from "./SuccessContent";

export const dynamic = "force-dynamic";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id?.toString();
  const upgraded = params.upgraded?.toString() === "true";

  if (!sessionId && !upgraded) {
    return redirect("/auth/profile/billing");
  }

  // Fetch current subscription details
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
  } catch (err) {
    serverLogger.error('billing:success', 'Error fetching cancellation details', err);
  }

  serverLogger.info(
    "billing:success",
    "subscription",
    subscription,
    "cancelAt",
    cancelAt,
    "isUpgrade",
    upgraded,
    "entitlements",
    entitlements
  );

  return (
    <SuccessContent 
      planLabel={subscription.planLabel ?? null} 
      currentPeriodEnd={subscription.currentPeriodEnd ?? null} 
      cancelAt={cancelAt}
      isUpgrade={upgraded}
      subscription={subscription}
      entitlements={entitlements}
    />
  );
}
