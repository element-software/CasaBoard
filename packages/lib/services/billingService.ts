import { Entitlements } from "@repo/types/subscription";

// Utility function to check if user is within their plan limits
export function withinLimits(ent: Entitlements, dashboards: number, haInstances: number, sidebars: number = 0): boolean {
  if (!ent.active) return false;
  const dashOk = ent.maxDashboards < 0 || dashboards <= ent.maxDashboards;
  const haOk = ent.maxHAInstances < 0 || haInstances <= ent.maxHAInstances;
  const sidebarOk = ent.maxSidebars < 0 || sidebars <= ent.maxSidebars;
  return dashOk && haOk && sidebarOk;
}


