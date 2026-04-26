import { SidebarActions, SubscriptionService, getLockedIds } from "@repo/lib";
import { SidebarManagement } from "@repo/ui/components/Sidebars/SidebarManagement";
import { notFound } from "next/navigation";

// Force dynamic rendering for this page since it uses cookies
export const dynamic = "force-dynamic";

export default async function SidebarsPage() {
  try {
    const [sidebars, entitlements] = await Promise.all([
      SidebarActions.getAllSidebars(),
      SubscriptionService.getEntitlementsForCurrentUser(),
    ]);

    const lockedSidebarIds = getLockedIds(sidebars, entitlements.maxSidebars);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-theme-text">
            Sidebar Management
          </h1>
          <p className="text-theme-text-secondary">
            Create and manage your custom sidebars
          </p>
        </div>

        <SidebarManagement
          showAllSidebars={true}
          initialSidebars={sidebars}
          entitlements={entitlements}
          lockedSidebarIds={lockedSidebarIds}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading sidebars:", error);
    notFound();
  }
}