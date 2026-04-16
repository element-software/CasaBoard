import { SubscriptionService } from "@repo/lib";
import { SubscriptionLapseBanner } from "@repo/ui/components/Shared/util/SubscriptionLapseBanner";
import { clientLogger } from "@repo/lib";

export const dynamic = 'force-dynamic';

export default async function SetupTemplate({ children }: { children: React.ReactNode }) {
  const ent = await SubscriptionService.getEntitlementsForCurrentUser();

  clientLogger.info('SetupTemplate', 'entitlements', { active: ent.active, planId: ent.planId });

  // active === false only when a previously-paid subscription has lapsed.
  // Free tier always returns active === true.
  if (!ent.active) {
    return <SubscriptionLapseBanner fullBlock>{children}</SubscriptionLapseBanner>;
  }
  return <>{children}</>;
}

