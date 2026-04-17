import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";
import { SidebarActions } from "@repo/lib";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function PageCreate() {
  const sidebars = await SidebarActions.getAllSidebars();

  return <PageEditorClient sidebars={sidebars} />;
}
