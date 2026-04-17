import type { Data } from "@measured/puck";
import SidebarEditorBody from "./SidebarEditorBody";
import { SubscriptionService } from "@repo/lib";

type SidebarEditorClientProps = {
  initialData?: Data;
  sidebarId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  initialSlug?: string;
};

export default async function SidebarEditorClient({
  initialData,
  sidebarId,
  initialPublished = true,
  initialSlug,
}: SidebarEditorClientProps) {
  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();

  return (
    <SidebarEditorBody
      entitlements={entitlements}
      initialData={initialData}
      sidebarId={sidebarId}
      initialPublished={initialPublished}
      initialSlug={initialSlug}
    />
  );
}
