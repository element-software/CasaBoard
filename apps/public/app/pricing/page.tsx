import {
  StripeService,
} from "@repo/lib";
import Pricing from "./pricing";
import Stripe from "stripe";

export default async function BillingPage() {
  // Fetch plans from Stripe
  let stripePlans: Array<Stripe.Price & { product: Stripe.Product }> = [];

  stripePlans = await StripeService.getAllPlans();

  return <Pricing stripePlans={stripePlans} />;
}
