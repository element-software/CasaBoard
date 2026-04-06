import { QuickActions } from "@repo/ui/components/QuickActions/index";
import { PagesManagement } from "@repo/ui/components/Pages/PagesManagement";
import { HAInstanceManager } from "@repo/ui/components/InstanceManager/HAInstanceManager";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-text">Setup Dashboard</h1>
        <p className="mt-2 text-theme-text-secondary">
          Manage your dashboard pages and Home Assistant configuration
        </p>
      </div>
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        <PagesManagement compact />
        <HAInstanceManager compact />
      </div>
      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>
    </div>
  );
}
