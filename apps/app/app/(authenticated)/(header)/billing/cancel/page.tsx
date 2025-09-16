import { redirect } from "next/navigation";
import { StripeService, SupabaseServer } from "@repo/lib";
import Stripe from "stripe";
import CancelContent from "./CancelContent";

export const dynamic = "force-dynamic";

export default async function BillingCancelPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const subId = typeof searchParams.sub_id === "string" ? searchParams.sub_id : undefined;
  if (!subId) return redirect("/billing");

  let planLabel: string | null = null;
  let currentPeriodEnd: string | null = null;
  try {
    const stripe = StripeService.getStripe();
    const subscription = await stripe.subscriptions.retrieve(subId);
    const sub: Stripe.Subscription = subscription as any;
    const supabase = await SupabaseServer.createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/billing");

    // Verify ownership by mapping customer -> user_id
    const customerId = (sub.customer as string) ?? undefined;
    if (!customerId) return redirect("/billing");
    const { data: map } = await supabase
      .from("billing_customers")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .single();
    if (!map || map.user_id !== user.id) return redirect("/billing");

    planLabel = (sub.items?.data?.[0]?.price?.product as any)?.name || (sub.items?.data?.[0]?.price?.nickname as string | null) || null;
    currentPeriodEnd = typeof (sub as any).current_period_end === "number"
      ? new Date(((sub as any).current_period_end as number) * 1000).toISOString()
      : null;
  } catch {}

  return <CancelContent planLabel={planLabel} currentPeriodEnd={currentPeriodEnd} />;
}


