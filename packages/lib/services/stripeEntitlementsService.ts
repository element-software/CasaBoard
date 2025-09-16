import { SupabaseServer, StripeService } from "..";

export class StripeEntitlementsService {
  /**
   * Sync the user's active entitlements from Stripe into public.user_entitlements.
   * Idempotent upsert per (user_id, feature_key).
   */
  static async syncCurrentUserEntitlements(): Promise<void> {
    const supabase = await SupabaseServer.createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Resolve Stripe customer id
    const { data: map } = await supabase
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    const customerId = map?.stripe_customer_id as string | undefined;
    if (!customerId) return;

    const stripe = StripeService.getStripe();
    // Ensure there is an active or trialing subscription
    const subsAll = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 5 });
    const hasValidSub = subsAll.data?.some((s: any) => s?.status && ["active", "trialing"].includes(s.status));

    // If no active subscription, clear cached entitlements for this user
    if (!hasValidSub) {
      await supabase.from("user_entitlements").delete().eq("user_id", user.id);
      return;
    }

    // Fetch active entitlements from Stripe (try customers.retrieveEntitlements first)
    let activeKeys: string[] = [];
    try {
      const entSummary: any = await (stripe.customers as any)?.retrieveEntitlements?.(customerId, { limit: 100, active: true });
      if (entSummary && Array.isArray(entSummary.data)) {
        activeKeys = entSummary.data
          .filter((e: any) => e?.active === true || e?.status === "active")
          .map((e: any) => e?.feature?.lookup_key || e?.feature_lookup_key)
          .filter(Boolean);
      }
    } catch {}
    // Fallback API shape
    if (activeKeys.length === 0) {
      try {
        const entitlements: any = await (stripe as any).entitlements?.list?.({ customer: customerId, limit: 100 });
        if (entitlements && Array.isArray(entitlements.data)) {
          activeKeys = entitlements.data
            .filter((e: any) => e?.active === true || e?.status === "active")
            .map((e: any) => e?.feature?.lookup_key || e?.feature_lookup_key)
            .filter(Boolean);
        }
      } catch {}
    }

    // If Entitlements API is not enabled or returns empty, derive from subscription metadata
    if (activeKeys.length === 0) {
      const activeSub = subsAll.data.find((s: any) => s?.status && ["active", "trialing"].includes(s.status));
      const metaPlan = activeSub?.metadata?.plan_id as string | undefined;
      const nickname = activeSub?.items?.data?.[0]?.price?.nickname as string | undefined;
      const planId = (metaPlan || nickname || "").toLowerCase();
      const planToFeature: Record<string, string> = {
        starter: "starter-access",
        mid: "mid-access",
        pro: "pro-access",
        super_25: "super_25-access",
        super_40: "super_40-access",
        super_60: "super_60-access",
      };
      const derived = planToFeature[planId];
      if (derived) activeKeys = [derived];
    }

    // Replace cache atomically-ish: delete missing, upsert present
    const { data: existing } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id);

    const existingSet = new Set<string>((existing || []).map((r: any) => r.feature_key as string));
    const incomingSet = new Set<string>(activeKeys);

    // Delete features no longer active
    const toDelete: string[] = Array.from(existingSet).filter((k) => !incomingSet.has(k));
    if (toDelete.length > 0) {
      await supabase
        .from("user_entitlements")
        .delete()
        .eq("user_id", user.id)
        .in("feature_key", toDelete);
    }

    // Upsert active features
    if (activeKeys.length > 0) {
      await supabase
        .from("user_entitlements")
        .upsert(
          activeKeys.map((k) => ({ user_id: user.id, feature_key: k, active: true, updated_at: new Date().toISOString() })),
          { onConflict: "user_id,feature_key" }
        );
    }
  }
  /**
   * Returns true if the current user has an active entitlement for the given feature lookup key.
   * Uses Stripe Billing Entitlements. See: https://docs.stripe.com/billing/entitlements
   */
  static async hasFeature(featureLookupKey: string): Promise<boolean> {
    const supabase = await SupabaseServer.createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Read from local cache first
    const { data } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id)
      .eq("feature_key", featureLookupKey)
      .limit(1);

    if (data && data.length > 0) return true;

    // Fallback: try a one-time sync then re-check
    await this.syncCurrentUserEntitlements();
    const { data: after } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id)
      .eq("feature_key", featureLookupKey)
      .limit(1);
    return Boolean(after && after.length > 0);
  }

  static async hasAnyFeature(featureLookupKeys: string[]): Promise<boolean> {
    const supabase = await SupabaseServer.createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check local cache
    const { data } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id);
    const set = new Set<string>((data || []).map((r: any) => r.feature_key as string));
    if (featureLookupKeys.some((k) => set.has(k))) return true;

    // Fallback one-time sync then re-check
    await this.syncCurrentUserEntitlements();
    const { data: after } = await supabase
      .from("user_entitlements")
      .select("feature_key")
      .eq("user_id", user.id);
    const setAfter = new Set<string>((after || []).map((r: any) => r.feature_key as string));
    return featureLookupKeys.some((k) => setAfter.has(k));
  }
}


