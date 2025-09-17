import { Entitlements, PlanId } from "@repo/types/subscription";
import { createClient, getCurrentAuthUser } from "../supabase/server";
import { resolveEntitlements } from "./billingService";
import { StripeEntitlementsService } from "./stripeEntitlementsService";

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
    const trialDays = process.env.TRIAL_DAYS ? parseInt(process.env.TRIAL_DAYS) : 3;
    const trialEndsAt = createdAt
      ? new Date(createdAt.getTime() + trialDays * 24 * 60 * 60 * 1000).toISOString()
      : null;
    const isWithinTrial = trialEndsAt ? new Date(trialEndsAt) > new Date() : false;
    if (isWithinTrial) {
      return resolveEntitlements("free-trial", trialEndsAt, true);
    }

    return resolveEntitlements("free-trial", trialEndsAt, false);
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


