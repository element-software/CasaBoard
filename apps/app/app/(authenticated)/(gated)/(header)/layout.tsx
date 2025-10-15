import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import {
  ConfigService,
  getCurrentAuthUser,
  serverLogger,
  SubscriptionService,
} from "@repo/lib";
import { redirect } from "next/navigation";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { Breadcrumbs } from "@repo/ui/components/Breadcrumbs/index";
import { SetupSidebar } from "@repo/ui/components/Setup/SetupSidebar";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch configuration server-side
  const initialConfig = await ConfigService.getServerConfig();

  // Ensure user is authenticated first
  const authedUser = await getCurrentAuthUser();
  if (!authedUser) {
    redirect("/auth/login?redirectTo=/auth/setup");
  }

  // Check if user needs trial setup
  const subscription =
    await SubscriptionService.getCurrentSubscriptionSummary();
  const isTrial = subscription.status === "trialing";

  // If user has no active subscription, redirect to trial setup
  // TODO: if users trial has ended, redirect to billing
  if (!isTrial && subscription.status !== "active") {
    redirect("/auth/setup");
  }

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <div className="min-h-screen">
        {/* Sidebar - Desktop fixed, Mobile drawer */}
        <SetupSidebar user={authedUser} className="fixed hidden md:flex" />

        {/* Main Content */}
        <div className="flex flex-1 flex-col md:ml-96">
          <Breadcrumbs />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </ConfigurationProvider>
  );
}
