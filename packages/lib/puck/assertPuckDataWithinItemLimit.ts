import type { Data } from "@measured/puck";
import { countPuckDataWidgets } from "./countPuckDataWidgets";
import { SubscriptionService } from "../services/subscriptionService";

/**
 * Enforces `maxItemsPerDashboard` from the current user's subscription. Safe to
 * call from server actions and API routes; do not import from client bundles.
 */
export async function assertPuckDataWithinItemLimit(
  puckData: Data | null | undefined
): Promise<void> {
  if (puckData == null) return;
  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();
  if (!entitlements.active || entitlements.maxItemsPerDashboard < 0) return;
  const n = countPuckDataWidgets(puckData);
  if (n > entitlements.maxItemsPerDashboard) {
    throw new Error(
      `This dashboard has ${n} items but your plan allows a maximum of ${entitlements.maxItemsPerDashboard}. Please remove some items before saving.`
    );
  }
}
