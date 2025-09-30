import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import {
  HAInstanceActions,
  ConfigService,
  getCurrentAuthUser,
  serverLogger,
  SubscriptionService,
} from "@repo/lib";
import { redirect } from "next/navigation";
import { Header } from "@repo/ui/components/Header/Header";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { Breadcrumbs } from "@repo/ui/components/Breadcrumbs/index";

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
  const subscription = await SubscriptionService.getCurrentSubscriptionSummary();
  const isTrial = subscription.status === 'trialing';
  
  // If user has no active subscription, redirect to trial setup
  if (!isTrial && subscription.status !== 'active') {
    redirect("/auth/setup");
  }

  const haInstance = await HAInstanceActions.getFirstHAInstance();
  serverLogger.info("Layout (gated)::", "subscription status", subscription.status, "isTrial", isTrial);

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <HassConnectWrapper haInstance={haInstance}>
          <Header user={authedUser} isTrial={isTrial} />
          <Breadcrumbs />
          <div className="min-h-screen">
            <main className="flex-1">{children}</main>
          </div>
          <Footer />
      </HassConnectWrapper>
    </ConfigurationProvider>
  );
}
