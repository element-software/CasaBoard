import { QuickActions } from "@repo/ui/components/Setup/QuickActions";
import { PageActions, SubscriptionService } from "@repo/lib";
import { Setup } from "./setup";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  let pages = [];
  let error = null;
  const entitlements = await SubscriptionService.getEntitlementsForCurrentUser();

  try {
    pages = await PageActions.getAllPages();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load pages";
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-text">Setup Dashboard</h1>
        <p className="mt-2 text-theme-text-secondary">
          Manage your dashboard pages and Home Assistant configuration
        </p>
      </div>
      <Setup
        pages={pages}
        error={error || undefined}
        entitlements={entitlements}
      />
      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>
    </div>
  );
}
