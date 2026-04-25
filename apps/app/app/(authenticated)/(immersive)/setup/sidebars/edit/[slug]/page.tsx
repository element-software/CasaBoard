import { SidebarActions, SubscriptionService } from "@repo/lib";
import SidebarEditorClient from "@repo/ui/components/puck/SidebarEditorClient";
import { notFound, redirect } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface SidebarEditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SidebarEditPage({
  params,
}: SidebarEditPageProps) {
  const { slug } = await params;

  const [sidebar, entitlements] = await Promise.all([
    SidebarActions.getSidebar(slug),
    SubscriptionService.getEntitlementsForCurrentUser(),
  ]);

  if (!sidebar) {
    notFound();
  }

  if (entitlements.maxSidebars === 0) {
    redirect("/setup/sidebars");
  }

  return (
    <SidebarEditorClient
      initialData={sidebar.puck_data}
      sidebarId={sidebar.id}
      userId={sidebar.user_id}
      initialPublished={true}
      initialSlug={sidebar.slug}
      initialThemeId={sidebar.theme_id ?? null}
    />
  );
}
