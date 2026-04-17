import type { Data } from "@measured/puck";
import PageEditorBody from "./PageEditorBody";
import { SubscriptionService } from "@repo/lib";

type PageEditorClientProps = {
  initialData?: Data;
  pageId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
};

export default async function PageEditorClient({
  initialData,
  pageId,
  initialPublished = false,
  sidebars = [],
  initialSlug,
}: PageEditorClientProps) {
  const entitlements =
    await SubscriptionService.getEntitlementsForCurrentUser();

  return (
    <PageEditorBody
      entitlements={entitlements}
      initialData={initialData}
      pageId={pageId}
      initialPublished={initialPublished}
      sidebars={sidebars}
      initialSlug={initialSlug}
    />
  );
}
