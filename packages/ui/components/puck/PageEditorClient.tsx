import PuckEditorClient from "./PuckEditorClient";
import { PageActions } from "@repo/lib";

type PageEditorClientProps = {
  initialData?: any;
  pageId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  haInstances?: { id: string; name: string; hass_url: string }[];
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
};

// Server action wrappers
async function createPageAction(data: any) {
  "use server";
  return await PageActions.createPage(data);
}

async function updatePageAction(slug: string, data: any) {
  "use server";
  return await PageActions.updatePage(slug, data);
}

async function publishPageAction(slug: string, published: boolean) {
  "use server";
  return await PageActions.updatePage(slug, { published });
}

export default function PageEditorClient({
  initialData,
  pageId,
  userId,
  initialPublished = false,
  haInstances = [],
  sidebars = [],
  initialSlug,
}: PageEditorClientProps) {
  return (
    <PuckEditorClient
      type="page"
      initialData={initialData}
      itemId={pageId}
      initialPublished={initialPublished}
      haInstances={haInstances}
      sidebars={sidebars}
      initialSlug={initialSlug}
      onCreateItem={createPageAction}
      onUpdateItem={updatePageAction}
      onPublishItem={publishPageAction}
      editUrlTemplate="/setup/pages/edit/{slug}"
      viewUrlTemplate="/dashboard/{slug}"
      backUrl="/setup/pages"
    />
  );
}