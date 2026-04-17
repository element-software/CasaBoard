import {
  PageActions,
  SubscriptionService,
} from "@repo/lib";
import { DashboardHAClient } from "@repo/ui/components/Shared/util/DashboardHAClient";
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
    const [pageData, entitlements] = await Promise.all([
      PageActions.getPageBySlug(page),
      SubscriptionService.getEntitlementsForCurrentUser(),
    ]);

    if (!pageData) {
      notFound();
    }

    return (
      <DashboardHAClient
        page={pageData}
        pageSlug={page}
        entitlements={entitlements}
      />
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}
