import { PageActions, SidebarActions, SubscriptionService, getLockedIds } from "@repo/lib";
import PageEditorClient from "@repo/ui/components/puck/PageEditorClient";
import { notFound, redirect } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PageEdit({ params }: PageProps) {
  const { slug } = await params;

  const [page, entitlements, allPages, sidebars] = await Promise.all([
    PageActions.getPage(slug),
    SubscriptionService.getEntitlementsForCurrentUser(),
    PageActions.getAllPages(),
    SidebarActions.getAllSidebars(),
  ]);

  if (!page) {
    notFound();
  }

  const lockedIds = new Set(getLockedIds(allPages, entitlements.maxDashboards));
  if (lockedIds.has(page.id)) {
    redirect("/auth/profile/billing");
  }

  return (
    <PageEditorClient
      initialData={page.puck_data}
      pageId={page.id}
      initialPublished={page.published}
      sidebars={sidebars}
      initialSlug={page.slug}
      initialThemeId={page.theme_id ?? null}
      initialThemeOverrides={page.theme_overrides ?? null}
    />
  );
}
