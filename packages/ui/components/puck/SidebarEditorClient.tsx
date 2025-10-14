import PuckEditorClient from "./PuckEditorClient";
import { SidebarActions } from "@repo/lib";

type SidebarEditorClientProps = {
  initialData?: any;
  sidebarId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  initialSlug?: string;
  haInstances?: { id: string; name: string; hass_url: string }[];
};

// Server action wrappers
async function createSidebarAction(data: any) {
  "use server";
  return await SidebarActions.createSidebar(data);
}

async function updateSidebarAction(slug: string, data: any) {
  "use server";
  return await SidebarActions.updateSidebar(slug, data);
}

export default function SidebarEditorClient({
  initialData,
  sidebarId,
  userId,
  initialPublished = true, // Sidebars are always "published"
  initialSlug,
  haInstances = [],
}: SidebarEditorClientProps) {
  return (
    <PuckEditorClient
      type="sidebar"
      initialData={initialData}
      itemId={sidebarId}
      initialPublished={initialPublished}
      haInstances={haInstances}
      initialSlug={initialSlug}
      onCreateItem={createSidebarAction}
      onUpdateItem={updateSidebarAction}
      // Sidebars don't have a publish state, so no onPublishItem
      editUrlTemplate="/setup/sidebars/edit/{slug}"
      // Sidebars don't have a view URL, so no viewUrlTemplate
      backUrl="/setup/sidebars"
    />
  );
}
