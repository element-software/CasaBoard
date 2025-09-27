import { StripeEntitlementsService } from "@repo/lib";
import { AccessBlocked } from "@repo/ui/components/AccessBlocked";
import { serverLogger } from "@repo/lib";

export const dynamic = 'force-dynamic';

export default async function SetupTemplate({ children }: { children: React.ReactNode }) {
  const hasAccess = await StripeEntitlementsService.hasAnyFeature([
    'starter-access',
    'mid-access',
    'pro-access',
  ]);

  serverLogger.info('SetupTemplate', 'hasAccess', hasAccess);
  if (!hasAccess) {
    return <AccessBlocked />;
  }
  return <>{children}</>;
}


