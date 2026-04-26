import { SidebarActions, SubscriptionService, getLockedIds } from "@repo/lib";
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

  const [allSidebars, entitlements] = await Promise.all([
    SidebarActions.getAllSidebars(),
    SubscriptionService.getEntitlementsForCurrentUser(),
  ]);

  const sidebar = allSidebars.find((s) => s.slug === slug);

  if (!sidebar) {
    notFound();
  }

  const lockedIds = new Set(getLockedIds(allSidebars, entitlements.maxSidebars));
  if (lockedIds.has(sidebar.id)) {
    redirect("/auth/profile/billing");
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
