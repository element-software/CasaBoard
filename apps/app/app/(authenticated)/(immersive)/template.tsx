import { SubscriptionService } from "@repo/lib";
import { SubscriptionLapseBanner } from "@repo/ui/components/Shared/util/SubscriptionLapseBanner";

export const dynamic = 'force-dynamic';

export default async function SetupTemplate({ children }: { children: React.ReactNode }) {
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();

  // active === false only when a previously-paid subscription has lapsed.
  // Free tier always returns active === true.
  if (!entitlements.active) {
    return <SubscriptionLapseBanner fullBlock>{children}</SubscriptionLapseBanner>;
  }
  return <>{children}</>;
}

