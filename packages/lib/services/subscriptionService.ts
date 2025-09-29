import { Entitlements, PlanId, SubscriptionSummary } from "@repo/types/subscription";
import { createClient, getCurrentAuthUser } from "../supabase/server";
import { resolveEntitlements } from "./billingService";
import { StripeService } from "./stripeService";

export class SubscriptionService {
  static async getEntitlementsForCurrentUser(): Promise<Entitlements> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();

    if (!user) {
      throw new Error("User not found");
    }

    // Stripe‑only: derive current plan/features directly from Stripe
    const { data: map } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    const customerId = map?.stripe_customer_id as string | undefined;
    if (!customerId) {
      return resolveEntitlements("free-trial", null, false);
    }

    const stripe = StripeService.getStripe();
    // Determine subscription status + trial
    const subsAll = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 5 });
    const sub = subsAll.data
      .slice()
      .sort((a, b) => (b.created || 0) - (a.created || 0))
      .find((s) => ["active", "trialing", "past_due", "unpaid"].includes(String(s.status)));
    const trialEndsAt = sub?.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;

    if (!sub) {
      return resolveEntitlements("free-trial", trialEndsAt, false);
    }

    // Get the current price ID from the subscription
    const currentPriceId = sub.items?.data?.[0]?.price?.id;
    if (!currentPriceId) {
      return resolveEntitlements("free-trial", trialEndsAt, false);
    }

    // Get the product information to determine the plan
    try {
      const price = await stripe.prices.retrieve(currentPriceId);
      const product = await stripe.products.retrieve(price.product as string);
      
      // Map product name to plan ID using StripeService logic
      const planId = this.getPlanIdFromProduct(product);
      
      const isActive = Boolean(sub && ["active", "trialing"].includes(String(sub.status)));
      return resolveEntitlements(planId, trialEndsAt, isActive);
    } catch (error) {
      // Fallback to metadata if product lookup fails
      const metaPlan = (sub?.metadata?.plan_id || "").toLowerCase();
      const planGuess = metaPlan as PlanId | "";
      if (planGuess && ["free-trial","starter","mid","pro","super_25","super_40","super_60"].includes(planGuess)) {
        const isActive = Boolean(sub && ["active", "trialing"].includes(String(sub.status)));
        return resolveEntitlements(planGuess as PlanId, trialEndsAt, isActive);
      }
      
      return resolveEntitlements("free-trial", trialEndsAt, false);
    }
  }

  static async getCurrentSubscriptionSummary(): Promise<SubscriptionSummary> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();
    if (!user) return { status: 'none', planId: 'unknown', trialEndsAt: null, hasPaymentMethod: null, planLabel: null, currentPeriodEnd: null };

    const { data: map } = await supabase
      .from('billing_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();
    const customerId = map?.stripe_customer_id as string | undefined;
    if (!customerId) return { status: 'none', planId: 'unknown', trialEndsAt: null, hasPaymentMethod: false, planLabel: null, currentPeriodEnd: null };

    const stripe = StripeService.getStripe();

    const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 10 });
    const pick = subs.data
      .slice()
      .sort((a, b) => (b.created || 0) - (a.created || 0))
      .find((s) => ['active', 'trialing', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired'].includes(String(s.status)));

    if (!pick) return { status: 'none', planId: 'unknown', trialEndsAt: null, hasPaymentMethod: false, planLabel: null, currentPeriodEnd: null };

    // Derive plan id
    const metaPlan = (pick.metadata?.plan_id || '').toLowerCase();
    const nickname = (pick.items?.data?.[0]?.price?.nickname || '').toLowerCase();
    const planString = (metaPlan || nickname) as string;
    const allowed: PlanId[] = ['free-trial','starter','mid','pro','super_25','super_40','super_60'];
    const derivedPlan = (allowed as string[]).includes(planString) ? (planString as PlanId) : ('unknown' as const);

    // Trial end
    const trialEndsAt = pick.trial_end ? new Date(pick.trial_end * 1000).toISOString() : null;

    // Payment methods present
    let hasPaymentMethod: boolean | null = null;
    try {
      const pms = await stripe.paymentMethods.list({ customer: customerId, type: 'card' });
      hasPaymentMethod = (pms?.data?.length || 0) > 0;
    } catch {
      hasPaymentMethod = null;
    }

    // Human-friendly plan label from product or price nickname
    let planLabel: string | null = null;
    const price: any = pick.items?.data?.[0]?.price || null;
    if (price) {
      if (typeof price.product === 'string') {
        try {
          const prod = await stripe.products.retrieve(price.product);
          planLabel = prod?.name || price?.nickname || planString || null;
        } catch {
          planLabel = price?.nickname || planString || null;
        }
      } else {
        planLabel = (price?.product as any)?.name || price?.nickname || planString || null;
      }
    }

    // Current period end
    const currentPeriodEnd = (pick as any).current_period_end ? new Date((pick as any).current_period_end * 1000).toISOString() : null;

    return { status: String(pick.status), planId: derivedPlan, trialEndsAt, hasPaymentMethod, planLabel, currentPeriodEnd };
  }
  /**
   * Ensure a Stripe 14‑day mid plan trial exists for the current user.
   * - Creates Stripe customer record and local mapping if missing
   * - Creates a subscription with trial_period_days=14 (no payment method required)
   * - Cancels automatically at trial end if no payment method added
   * - Returns true if a trial was created, false if user already has a subscription
   */
  static async ensureTrialOnFirstLogin(): Promise<boolean> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();
    if (!user) return false;

    // Resolve Stripe customer id mapping
    let customerId = await this.getStripeCustomerIdForCurrentUser();
    const stripe = StripeService.getStripe();

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { user_id: user.id },
      });
      await supabase
        .from("billing_customers")
        .insert({ user_id: user.id, stripe_customer_id: customer.id })
        .select()
        .single();
      customerId = customer.id;
    }

    // If any existing sub (active/trialing/past_due/unpaid), bail out
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 5,
    });
    const hasAny = subs.data?.some((s) =>
      ["active", "trialing", "past_due", "unpaid"].includes(String(s.status))
    );
    if (hasAny) return false;

    // Create mid plan trial subscription
    const priceId = await StripeService.getCheckoutPriceForPlan("mid", "monthly");
    await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: 14,
      collection_method: "charge_automatically",
      trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
      metadata: { plan_id: "mid", origin: "auto-free-trial" },
    });

    // Note: No local entitlements cache needed - using Stripe-only entitlements
    // Return true to indicate trial was created
    return true;
  }

  static async getStripeCustomerIdForCurrentUser(): Promise<string | null> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();
    if (!user) return null;

    const { data } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    return data?.stripe_customer_id ?? null;
  }

  private static getPlanIdFromProduct(product: any): PlanId {
    // Map Stripe product to plan ID using similar logic to StripeService
    const productName = (product.name || "").toLowerCase();
    const byMeta = (product.metadata?.plan_id || product.metadata?.lookup_key || "").toLowerCase();
    
    // Check metadata first
    if (byMeta && ["free-trial","starter","mid","pro","super_25","super_40","super_60"].includes(byMeta)) {
      return byMeta as PlanId;
    }
    
    // Check product name patterns
    if (productName.includes("mid") || productName.includes("standard")) return "mid";
    if (productName.includes("pro") || productName.includes("professional")) return "pro";
    if (productName.includes("starter")) return "starter";
    if (productName.includes("super") && productName.includes("25")) return "super_25";
    if (productName.includes("super") && productName.includes("40")) return "super_40";
    if (productName.includes("super") && productName.includes("60")) return "super_60";
    if (productName.includes("trial") || productName.includes("free")) return "free-trial";
    
    // Default fallback
    return "free-trial";
  }

  private static getPlanFromFeatureKeys(keys: Set<string>): PlanId | null {
    // Map your feature lookup keys -> plan ids
    if (keys.has("pro-access")) return "pro";
    if (keys.has("mid-access")) return "mid";
    if (keys.has("starter-access")) return "starter";
    if (keys.has("super_60-access")) return "super_60";
    if (keys.has("super_40-access")) return "super_40";
    if (keys.has("super_25-access")) return "super_25";
    return null;
  }
}


