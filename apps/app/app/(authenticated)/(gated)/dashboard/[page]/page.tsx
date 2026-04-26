import {
  PageActions,
  SubscriptionService,
  resolveDashboardThemeStyles,
  getLockedIds,
} from "@repo/lib";
import { DashboardHAClient } from "@repo/ui/components/Shared/util/DashboardHAClient";
import { PlanLockPage } from "@repo/ui/components/Shared/util/PlanLockOverlay";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function ConfigurablePage({ params }: PageProps) {
  const { page } = await params;

  try {
    const [pageData, entitlements, allPages] = await Promise.all([
      PageActions.getPageBySlug(page),
      SubscriptionService.getEntitlementsForCurrentUser(),
      PageActions.getAllPages(),
    ]);

    if (!pageData) {
      notFound();
    }

    const lockedIds = new Set(getLockedIds(allPages, entitlements.maxDashboards));
    if (lockedIds.has(pageData.id)) {
      return <PlanLockPage name={pageData.slug} />;
    }

    const themeStyles = await resolveDashboardThemeStyles(pageData);

    return (
      <DashboardHAClient
        page={pageData}
        pageSlug={page}
        entitlements={entitlements}
        themeMainStyle={themeStyles.main}
        themeSidebarStyle={themeStyles.sidebar}
      />
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}
