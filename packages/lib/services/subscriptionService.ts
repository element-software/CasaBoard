import { Entitlements, PlanId } from "@repo/types/subscription";
import { createClient, getCurrentAuthUser } from "../supabase/server";
import { resolveEntitlements } from "./billingService";
import { StripeEntitlementsService } from "./stripeEntitlementsService";
import { StripeService } from "./stripeService";
import { redirect } from "next/navigation";
import { LinkService } from "..";

export class SubscriptionService {
  static async getEntitlementsForCurrentUser(): Promise<Entitlements> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();

    if (!user) {
      return {
        planId: "free-trial",
        maxDashboards: 0,
        maxHAInstances: 0,
        trialEndsAt: null,
        active: false,
      };
    }

    // 1) Try local feature cache (synced via webhook or on-demand)
    const { data: features } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id);

    const featureKeys = new Set((features || []).map((r: any) => r.feature_key as string));

    const planFromFeatures = this.getPlanFromFeatureKeys(featureKeys);
    if (planFromFeatures) {
      return resolveEntitlements(planFromFeatures, null, true);
    }

    // 2) Fallback: one-time sync from Stripe then re-check
    await StripeEntitlementsService.syncCurrentUserEntitlements();
    const { data: featuresAfter } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id);
    const featureKeysAfter = new Set((featuresAfter || []).map((r: any) => r.feature_key as string));
    const planAfter = this.getPlanFromFeatureKeys(featureKeysAfter);
    if (planAfter) {
      return resolveEntitlements(planAfter, null, true);
    }

    // 3) Trial fallback by created_at
    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const trialDays = process.env.TRIAL_DAYS ? parseInt(process.env.TRIAL_DAYS) : 14;
    const trialEndsAt = createdAt
      ? new Date(createdAt.getTime() + trialDays * 24 * 60 * 60 * 1000).toISOString()
      : null;
    const isWithinTrial = trialEndsAt ? new Date(trialEndsAt) > new Date() : false;
    if (isWithinTrial) {
      return resolveEntitlements("free-trial", trialEndsAt, true);
    }

    return resolveEntitlements("free-trial", trialEndsAt, false);
  }

  /**
   * Ensure a Stripe 14‑day mid plan trial exists for the current user.
   * - Creates Stripe customer record and local mapping if missing
   * - Creates a subscription with trial_period_days=14 (no payment method required)
   * - Cancels automatically at trial end if no payment method added
   * - Grants local 'mid-access' entitlement immediately so the app is usable
   */
  static async ensureTrialOnFirstLogin(): Promise<void> {
    const supabase = await createClient();
    const user = await getCurrentAuthUser();
    if (!user) return;

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
    if (hasAny) return;

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

    // Grant local entitlements immediately during trial window
    await supabase.from("user_entitlements").upsert(
      [
        {
          user_id: user.id,
          feature_key: "mid-access",
          active: true,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id,feature_key" }
    );

    redirect(LinkService.crossAppHref("app", "/setup"));
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


