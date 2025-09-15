import { SubscriptionService } from "@repo/lib";
import BillingContent from "./BillingContent";

export default async function BillingPage() {
  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();
  return <BillingContent entitlements={entitlements} />;
}
