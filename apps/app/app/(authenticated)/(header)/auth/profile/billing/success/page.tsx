import { redirect } from "next/navigation";
import {
  StripeService,
  SupabaseServer,
  StripeEntitlementsService,
  getCurrentAuthUser,
} from "@repo/lib";
import Stripe from "stripe";
import SuccessContent from "./SuccessContent";

export const dynamic = "force-dynamic";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sessionId = (await searchParams).session_id?.toString();

  if (!sessionId) {
    return redirect("/auth/profile/billing");
  }

  let planLabel: string | null = null;
  let currentPeriodEnd: string | null = null;
  try {
    const stripe = StripeService.getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : undefined;
    if (!subscriptionId) {
      return redirect("/billing?success=1");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sub: Stripe.Subscription = subscription as any;
    const planId =
      (sub.metadata?.plan_id as string | undefined) ||
      (sub.items?.data?.[0]?.price?.nickname as string | undefined) ||
      "starter";
    const status = sub.status as string;
    const periodEnd =
      typeof (sub as any).current_period_end === "number"
        ? new Date(
            ((sub as any).current_period_end as number) * 1000
          ).toISOString()
        : null;
    currentPeriodEnd = periodEnd;
    planLabel = (sub.items?.data?.[0]?.price?.product as any)?.name || planId;

    const supabase = await SupabaseServer.createClient();
    const user = await getCurrentAuthUser();
    if (user) {
      await supabase.from("subscriptions").insert({
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
    console.error("Cancel subscription failed ");
    console.error(err);
  }

  return (
    <SuccessContent planLabel={planLabel} currentPeriodEnd={currentPeriodEnd} />
  );
}
