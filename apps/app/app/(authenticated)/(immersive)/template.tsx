import { SubscriptionService } from "@repo/lib";
import { AccessBlocked } from "@repo/ui/components/Shared/util/AccessBlocked";

export const dynamic = 'force-dynamic';

export default async function SetupTemplate({ children }: { children: React.ReactNode }) {
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();
  if (!entitlements.active) {
    return <AccessBlocked />;
  }
  return <>{children}</>;
}


