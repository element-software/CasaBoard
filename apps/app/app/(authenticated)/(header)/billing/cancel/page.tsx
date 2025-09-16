import { redirect } from "next/navigation";
import { StripeService, SupabaseServer } from "@repo/lib";
import Stripe from "stripe";
import CancelContent from "./CancelContent";

export const dynamic = "force-dynamic";

const getData = async (subId: string) => {
  const stripe = StripeService.getStripe();
  const subscription = await stripe.subscriptions.retrieve(subId);
  const sub: Stripe.Subscription = subscription as any;
  const supabase = await SupabaseServer.createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/billing");
  const customerId = (sub.customer as string) ?? undefined;
  if (!customerId) return redirect("/billing");
  const { data: map } = await supabase
    .from("billing_customers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (!map || map.user_id !== user.id) return redirect("/billing");

  console.log("Sub:", sub)

  const product = await stripe.products.retrieve(sub.items.data[0].price.product as string);
  const planLabel =
    product.name
  const cancelAt =
    typeof (sub as any).cancel_at === "number"
      ? new Date(
          ((sub as any).cancel_at as number) * 1000
        ).toISOString()
      : null;

  return { planLabel: planLabel ?? null, currentPeriodEnd: cancelAt ?? null };
};

export default async function BillingCancelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const subId = typeof params.sub_id === "string" ? params.sub_id : undefined;
  if (!subId) return redirect("/billing");

  const { planLabel, currentPeriodEnd } = await getData(subId);

  return (
    <CancelContent planLabel={planLabel} currentPeriodEnd={currentPeriodEnd} />
  );
}
