import { SubscriptionService } from "@repo/lib";
import { AccessBlocked } from "@repo/ui/components/Shared/util/AccessBlocked";
import { clientLogger } from "@repo/lib";

export const dynamic = 'force-dynamic';

export default async function SetupTemplate({ children }: { children: React.ReactNode }) {
  const ent = await SubscriptionService.getEntitlementsForCurrentUser();
  const hasAccess = ent.active;

  clientLogger.info('SetupTemplate', 'hasAccess', hasAccess);
  if (!hasAccess) {
    return <AccessBlocked />;
  }
  return <>{children}</>;
}


