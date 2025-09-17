import { StripeEntitlementsService } from "@repo/lib";
import { AccessBlocked } from "@repo/ui/components/AccessBlocked";

export const dynamic = 'force-dynamic';

export default async function SetupTemplate({ children }: { children: React.ReactNode }) {
  const hasAccess = await StripeEntitlementsService.hasAnyFeature([
    'starter-access',
    'mid-access',
    'pro-access',
  ]);

  console.log("SetupTemplate:: hasAccess:", hasAccess);
  if (!hasAccess) {
    return <AccessBlocked />;
  }
  return <>{children}</>;
}


