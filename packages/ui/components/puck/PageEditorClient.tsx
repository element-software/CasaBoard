import PuckEditorClient from "./PuckEditorClient";

type PageEditorClientProps = {
  initialData?: any;
  pageId?: string | null;
  userId?: string | null;
  initialPublished?: boolean;
  haInstances?: { id: string; name: string; hass_url: string }[];
  sidebars?: { id: string; name: string; slug: string }[];
  initialSlug?: string;
};

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
    />
  );
}