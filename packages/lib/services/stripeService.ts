import Stripe from "stripe";
import { PlanId } from "@repo/types/subscription";

export class StripeService {
  private static stripeSingleton: Stripe | null = null;

  static getStripe(): Stripe {
    if (this.stripeSingleton) return this.stripeSingleton;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Missing STRIPE_SECRET_KEY env var");
    }
    this.stripeSingleton = new Stripe(key, {
      apiVersion: "2025-08-27.basil",
    });
    return this.stripeSingleton;
  }

  static getPriceIdForPlan(planId: PlanId): string {
    const priceMap: Record<PlanId, string | undefined> = {
      "free-trial": undefined,
      starter: "prod_T37yH2eRvaylZ0",
      mid: "prod_T37y69atl58dbS",
      pro: "prod_T37yFsR2kCSbFE",
      super_25: process.env.STRIPE_PRICE_SUPER_25,
      super_40: process.env.STRIPE_PRICE_SUPER_40,
      super_60: process.env.STRIPE_PRICE_SUPER_60,
    };
    const priceId = priceMap[planId];
    if (!priceId) {
      throw new Error(`Missing Stripe price env for plan: ${planId}`);
    }
    return priceId;
  }

  static async getCheckoutPriceForPlan(planId: PlanId): Promise<string> {
    const id = this.getPriceIdForPlan(planId);
    if (id.startsWith("price_")) return id;
    if (id.startsWith("prod_")) {
      const stripe = this.getStripe();
      const product = await stripe.products.retrieve(id, { expand: ["default_price"] });
      const defaultPrice = (product.default_price as any)?.id as string | undefined;
      if (defaultPrice && defaultPrice.startsWith("price_")) return defaultPrice;
      const prices = await stripe.prices.list({ product: id, active: true, limit: 1 });
      const first = prices.data[0]?.id;
      if (first) return first;
      throw new Error(`No active prices found for product ${id}`);
    }
    throw new Error(`Unrecognized Stripe id format for plan ${planId}: ${id}`);
  }
}

