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

  private static planNames: Record<PlanId, string[]> = {
    "free-trial": ["Free Trial", "Trial"],
    starter: ["Starter"],
    mid: ["Mid", "Standard"],
    pro: ["Pro", "Professional"],
    super_25: ["Super 25"],
    super_40: ["Super 40"],
    super_60: ["Super 60"],
  };

  private static matchesPlan(product: Stripe.Product, planId: PlanId): boolean {
    const names = this.planNames[planId] || [];
    const byMeta = (product.metadata?.plan_id || product.metadata?.lookup_key || "").toLowerCase();
    if (byMeta === planId.toLowerCase()) return true;
    const productName = (product.name || "").toLowerCase();
    if (names.some((n) => n.toLowerCase() === productName)) return true;
    // allow loose contains match as a last resort
    if (names.some((n) => productName.includes(n.toLowerCase()))) return true;
    if (productName === planId.toLowerCase()) return true;
    return false;
  }

  static async findProductForPlan(planId: PlanId): Promise<Stripe.Product> {
    const stripe = this.getStripe();
    // Prefer search, fallback to list if search not enabled
    try {
      // @ts-ignore - search may not be available on older typings
      if (typeof (stripe.products as any).search === "function") {
        const query = `active:'true' AND (metadata['plan_id']:'${planId}' OR metadata['lookup_key']:'${planId}' OR name:'${this.planNames[planId]?.[0] || planId}')`;
        const res = await (stripe.products as any).search({ query, limit: 20 });
        const found = res?.data?.find((p: Stripe.Product) => this.matchesPlan(p, planId));
        if (found) return found;
      }
    } catch {}
    // Fallback: list and filter
    const list = await stripe.products.list({ active: true, limit: 100 });
    const prod = list.data.find((p) => this.matchesPlan(p, planId));
    if (!prod) throw new Error(`Stripe product not found for plan ${planId}`);
    return prod;
  }

  static async getCheckoutPriceForPlan(planId: PlanId, interval: "monthly" | "yearly" = "monthly"): Promise<string> {
    const product = await this.findProductForPlan(planId);
    const stripe = this.getStripe();
    const wantedInterval = interval === "yearly" ? "year" : "month";
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
    // Prefer interval_count 1
    const candidates = prices.data.filter((p) => p.recurring?.interval === wantedInterval);
    const preferred = candidates.find((p) => (p.recurring?.interval_count || 1) === 1) || candidates[0];
    if (preferred?.id) return preferred.id;
    // Fallback to product.default_price if it matches
    if (product.default_price && typeof product.default_price !== "string") {
      const rp = product.default_price;
      if (rp?.id && rp.recurring?.interval === wantedInterval) return rp.id;
    } else if (typeof product.default_price === "string") {
      const dp = await stripe.prices.retrieve(product.default_price);
      if (dp?.id && dp.recurring?.interval === wantedInterval) return dp.id;
    }
    throw new Error(`No active ${interval} price found for plan ${planId}`);
  }

  static async getAllPlans(): Promise<Array<Stripe.Price & { product: Stripe.Product }>> {
    const stripe = this.getStripe();
    
    try {
      // Fetch all active products
      const products = await stripe.products.list({
        active: true,
        limit: 100,
      });

      // Get all prices for these products
      const allPrices = await Promise.all(
        products.data.map(async (product) => {
          const prices = await stripe.prices.list({
            product: product.id,
            active: true,
            limit: 100,
          });
          return prices.data.map(price => ({
            ...price,
            product: product,
          }));
        })
      );

      // Flatten and filter for subscription prices
      const plans = allPrices
        .flat()
        .filter(price => price.type === 'recurring')
        .sort((a, b) => {
          // Sort by amount (price)
          return (a.unit_amount || 0) - (b.unit_amount || 0);
        });

      return plans;
    } catch (error) {
      throw new Error(`Failed to fetch Stripe plans: ${error}`);
    }
  }
}

