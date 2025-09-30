import { ConfigurationProvider } from "@repo/ui/components/Shared/util/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/Shared/util/HassConnectWrapper";
import {
  HAInstanceActions,
  ConfigService,
  getCurrentAuthUser,
  SubscriptionService,
} from "@repo/lib";
import { Footer } from "@repo/ui/components/Shared/Footer/index";
import { redirect } from "next/navigation";

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
    redirect("/auth/login?redirectTo=/");
  }

  // Check if user needs trial setup
  const subscription = await SubscriptionService.getCurrentSubscriptionSummary();
  const isTrial = subscription.status === 'trialing';
  
  // If user has no active subscription, redirect to trial setup
  if (!isTrial && subscription.status !== 'active') {
    redirect("/auth/setup");
  }

  // Fetch first instance (pages are tied per-instance; active flag removed)
  const haInstance = await HAInstanceActions.getFirstHAInstance();

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <HassConnectWrapper haInstance={haInstance}>
        <div className="min-h-screen">
          <main className="flex-1 h-full">{children}</main>
          <Footer />
        </div>
      </HassConnectWrapper>
    </ConfigurationProvider>
  );
}
