import { PageActions, PublishSettingsActions, serverLogger } from "@repo/lib";
import { PagesManagement } from "@repo/ui/components/Pages/PagesManagement";
import { SetupPageShell } from "@repo/ui/components/Setup/SetupPageShell";
import { Page } from "@repo/types/page";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function PagesListPage() {
  let pages: Page[] = [];
  let error = null;
  let publicBaseUrl = "";
  try {
    const [allPages, publishSettings] = await Promise.all([
      PageActions.getAllPages(),
      PublishSettingsActions.getPublishSettings(),
    ]);
    pages = allPages;
    publicBaseUrl = publishSettings.publicBaseUrl;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load pages";
  }

  serverLogger.info("SetupPages", "pages", pages, "error", error);

  return (
    <SetupPageShell
      title="Pages"
      subtitle={`${pages.length} page${pages.length !== 1 ? "s" : ""} total`}
    >
      <PagesManagement
        initialPages={pages}
        initialError={error}
        showAllPages={true}
        showHeader={false}
        publicBaseUrl={publicBaseUrl}
      />
    </SetupPageShell>
  );
}
