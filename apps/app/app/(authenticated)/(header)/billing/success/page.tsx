import { redirect } from "next/navigation";
import { StripeService, SupabaseServer, StripeEntitlementsService } from "@repo/lib";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export default async function BillingSuccessPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const sessionId = typeof searchParams.session_id === "string" ? searchParams.session_id : undefined;
  if (!sessionId) {
    return redirect("/billing");
  }

  try {
    const stripe = StripeService.getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;
    if (!subscriptionId) {
      return redirect("/billing?success=1");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sub = subscription as Stripe.Subscription;
    const planId = (sub.metadata?.plan_id as string | undefined) || (sub.items?.data?.[0]?.price?.nickname as string | undefined) || "starter";
    const status = sub.status as string;
    const periodEnd = typeof sub.current_period_end === "number" ? new Date(sub.current_period_end * 1000).toISOString() : null;

    const supabase = await SupabaseServer.createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_id: planId,
          status,
          current_period_end: periodEnd,
        });
      // After successful checkout, sync user's entitlements cache so gating unlocks immediately
      await StripeEntitlementsService.syncCurrentUserEntitlements();
    }
  } catch (err) {
    // ignore and continue to billing
  }

  return redirect("/billing?success=1");
}


