import { PageActions, SubscriptionService, serverLogger } from "@repo/lib";
import Link from "next/link";
import { PagesManagement } from "@repo/ui/components/Pages/PagesManagement";
import { Page } from "@repo/types/page";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = "force-dynamic";

export default async function PagesListPage() {
  let pages: Page[] = [];
  let error = null;
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();
  try {
    pages = await PageActions.getAllPages();
    console.log("PagesListPage", "pages", pages);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load pages";
  }

  serverLogger.info("SetupPages", "pages", pages, "error", error);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PagesManagement initialPages={pages} initialError={error} entitlements={entitlements} />

      <div className="mt-8 pt-6 border-t border-theme-border">
        <Link
          href="/setup"
          className="inline-flex items-center text-theme-text-secondary hover:text-theme-text transition-colors"
        >
          ← Back to Setup Dashboard
        </Link>
      </div>
    </div>
  );
}
