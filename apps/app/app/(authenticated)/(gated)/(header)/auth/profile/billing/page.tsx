import { SubscriptionService, StripeService, SupabaseServer, serverLogger, getCurrentAuthUser } from "@repo/lib";
import BillingContent from "./BillingContent";
import Stripe from "stripe";

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

  // Fetch plans from Stripe
  let stripePlans: Array<Stripe.Price & { product: Stripe.Product }> = [];
  let currentPriceId: string | null = null;
  
  try {
    stripePlans = await StripeService.getAllPlans();
    
    // Get current subscription's price ID
    if (entitlements.active) {
      const user = await getCurrentAuthUser();
      if (user) {
        const supabase = await SupabaseServer.createClient();
        const { data: map } = await supabase
          .from("billing_customers")
          .select("stripe_customer_id")
          .eq("user_id", user.id)
          .single();
        
        if (map?.stripe_customer_id) {
          const stripe = StripeService.getStripe();
          const subs = await stripe.subscriptions.list({ 
            customer: map.stripe_customer_id, 
            status: "all", 
            limit: 1 
          });
          
          const currentSub = subs.data.find(s => 
            ["active", "trialing", "past_due", "unpaid"].includes(s.status)
          );
          
          if (currentSub?.items?.data?.[0]?.price?.id) {
            currentPriceId = currentSub.items.data[0].price.id;
          }
        }
      }
    }
    
    serverLogger.info("billing:page", "Fetched Stripe plans", {
      count: stripePlans.length,
      currentPriceId,
      plans: stripePlans.map(p => ({
        id: p.id,
        productName: p.product.name,
        amount: p.unit_amount,
        interval: p.recurring?.interval
      }))
    });
  } catch (error) {
    serverLogger.error("billing:page", "Failed to fetch Stripe plans", error);
  }

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
      stripePlans={stripePlans}
      currentPriceId={currentPriceId}
    />
  );
}
