import { Entitlements } from "@repo/types/subscription";

export const EMULATION_EMAIL = "iqbalibrahim1992@gmail.com";
export const EMULATION_COOKIE = "plan_emulation";

export type EmulatedTier = "free" | "starter" | "mid" | "pro" | "lapsed";

export const EMULATED_ENTITLEMENTS: Record<EmulatedTier, Entitlements> = {
  free: {
    planId: "free",
    maxDashboards: 1,
    maxHAInstances: 1,
    maxSidebars: 0,
    maxItemsPerDashboard: 20,
    trialEndsAt: null,
    active: true,
    haCloudSync: false,
  },
  starter: {
    planId: "starter",
    maxDashboards: 3,
    maxHAInstances: 2,
    maxSidebars: 2,
    maxItemsPerDashboard: -1,
    trialEndsAt: null,
    active: true,
    haCloudSync: false,
  },
  mid: {
    planId: "mid",
    maxDashboards: 5,
    maxHAInstances: 3,
    maxSidebars: 5,
    maxItemsPerDashboard: -1,
    trialEndsAt: null,
    active: true,
    haCloudSync: true,
  },
  pro: {
    planId: "pro",
    maxDashboards: -1,
    maxHAInstances: -1,
    maxSidebars: -1,
    maxItemsPerDashboard: -1,
    trialEndsAt: null,
    active: true,
    haCloudSync: true,
  },
  // Simulates a paid subscription that has lapsed — triggers the SubscriptionLapseBanner
  lapsed: {
    planId: "free",
    maxDashboards: 1,
    maxHAInstances: 1,
    maxSidebars: 0,
    maxItemsPerDashboard: 20,
    trialEndsAt: null,
    active: false,
    haCloudSync: false,
  },
};

/** Returns fake entitlements if emulation is active for this email, otherwise null. */
export async function getEmulatedEntitlements(
  email: string
): Promise<Entitlements | null> {
  if (email !== EMULATION_EMAIL) return null;
  // Dynamic import keeps next/headers out of the client bundle (static imports are analysed
  // by Turbopack and would cause a build error when this module is transitively included
  // in a client component via the lib barrel).
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const tier = cookieStore.get(EMULATION_COOKIE)?.value as
    | EmulatedTier
    | undefined;
  if (!tier || !EMULATED_ENTITLEMENTS[tier]) return null;
  return EMULATED_ENTITLEMENTS[tier];
}
