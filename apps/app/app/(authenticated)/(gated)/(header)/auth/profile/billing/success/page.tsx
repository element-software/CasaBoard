import { redirect } from "next/navigation";
import { StripeService, serverLogger } from "@repo/lib";
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
      return redirect("/auth/profile/billing?success=1");
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

    // No database writes here; data is read directly from Stripe
  } catch (err) {
    // ignore and continue to billing
    serverLogger.error('billing:success', 'Error', err);
  }

  return (
    <SuccessContent planLabel={planLabel} currentPeriodEnd={currentPeriodEnd} />
  );
}
