import { Entitlements, PlanId } from "@repo/types/subscription";
import { createClient } from "../supabase/server";
import { resolveEntitlements } from "./billingService";

export class SubscriptionService {
  static async getEntitlementsForCurrentUser(): Promise<Entitlements> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        planId: "free-trial",
        maxDashboards: 0,
        maxHAInstances: 0,
        trialEndsAt: null,
        active: false,
      };
    }

    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const trialDays = process.env.TRIAL_DAYS ? parseInt(process.env.TRIAL_DAYS) : 3;
    const trialEndsAt = createdAt
      ? new Date(createdAt.getTime() + trialDays * 24 * 60 * 60 * 1000).toISOString()
      : null;
    const now = new Date();

    // Get the most recent subscription for this user
    const { data: subs, error } = await supabase
      .from("subscriptions")
      .select("plan_id,status,current_period_end,trial_ends_at,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      // Fail safe: fall back to trial if within 30 days
      const isWithinTrial = trialEndsAt && new Date(trialEndsAt) > now;
      return resolveEntitlements(
        "free-trial",
        trialEndsAt,
        Boolean(isWithinTrial)
      );
    }

    const sub = subs && subs.length > 0 ? subs[0] : null;
    const subStatus = (sub?.status as
      | "trialing"
      | "active"
      | "past_due"
      | "canceled"
      | "incomplete"
      | "unpaid"
      | undefined) as any;

    const hasActiveSub = subStatus === "active" || subStatus === "trialing";
    const isWithinTrial = trialEndsAt && new Date(trialEndsAt) > now;

    if (hasActiveSub && sub?.plan_id) {
      return resolveEntitlements(sub.plan_id as PlanId, sub.trial_ends_at || null, true);
    }

    if (isWithinTrial) {
      return resolveEntitlements("free-trial", trialEndsAt, true);
    }

    // No active access
    return resolveEntitlements((sub?.plan_id as PlanId) || "free-trial", trialEndsAt, false);
  }

  static async getStripeCustomerIdForCurrentUser(): Promise<string | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    return data?.stripe_customer_id ?? null;
  }
}


