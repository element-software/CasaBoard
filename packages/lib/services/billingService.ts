import { Entitlements, PlanId } from "@repo/types/subscription";

// Plan matrix
const PLAN_ENTITLEMENTS: Record<PlanId, Omit<Entitlements, "planId" | "trialEndsAt" | "active">> = {
  // Free trial: unlimited dashboards for 30 days, 1 HA instance
  // We encode "unlimited" as -1
  "free-trial": { maxDashboards: 1, maxHAInstances: 1 },
  starter: { maxDashboards: 1, maxHAInstances: 1 },
  mid: { maxDashboards: 3, maxHAInstances: 1 },
  pro: { maxDashboards: 6, maxHAInstances: 1 },
  super_25: { maxDashboards: 10, maxHAInstances: 3 },
  super_40: { maxDashboards: 20, maxHAInstances: 5 },
  super_60: { maxDashboards: 50, maxHAInstances: 10 },
};

export function resolveEntitlements(planId: PlanId, trialEndsAt?: string | null, active = true): Entitlements {
  const base = PLAN_ENTITLEMENTS[planId];
  return { planId, trialEndsAt: trialEndsAt ?? null, active, ...base };
}

export function withinLimits(ent: Entitlements, dashboards: number, haInstances: number): boolean {
  if (!ent.active) return false;
  const dashOk = ent.maxDashboards < 0 || dashboards <= ent.maxDashboards;
  const haOk = ent.maxHAInstances < 0 || haInstances <= ent.maxHAInstances;
  return dashOk && haOk;
}


