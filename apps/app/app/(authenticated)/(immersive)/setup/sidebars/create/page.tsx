import PuckEditorClient from "@repo/ui/components/puck/PuckEditorClient";

export const dynamic = "force-dynamic";

export default function SidebarCreatePage() {
  return (
    <PuckEditorClient
      type="sidebar"
      initialData={{ content: [], root: { props: {} } }}
      itemId={null}
      userId={null}
      initialPublished={true} // Sidebars are always "published"
    />
  );
}
