import SidebarEditorClient from "@repo/ui/components/puck/SidebarEditorClient";
import { SubscriptionService } from "@repo/lib";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SidebarCreatePage() {
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();

  if (entitlements.maxSidebars === 0) {
    redirect("/setup/sidebars");
  }

  return <SidebarEditorClient />;
}
