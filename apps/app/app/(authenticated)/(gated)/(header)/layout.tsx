import { ConfigurationProvider } from "@repo/ui/components/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/HassConnectWrapper";
import {
  HAInstanceActions,
  ConfigService,
  getCurrentAuthUser,
  serverLogger,
} from "@repo/lib";
import { redirect } from "next/navigation";
import { Header } from "@repo/ui/components/Header/Header";
import { Footer } from "@repo/ui/components/Footer";
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
    redirect("/auth/login?redirectTo=/setup");
  }

  const haInstance = await HAInstanceActions.getFirstHAInstance();

  const mainContent = () => (
    <>
      <Header user={authedUser} />
      <Breadcrumbs />
      <div className="min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );

  if (!haInstance) {
    return (
      <ConfigurationProvider initialConfig={initialConfig}>
        {mainContent()}
      </ConfigurationProvider>
    );
  }

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <HassConnectWrapper haInstance={haInstance}>
        {mainContent()}
      </HassConnectWrapper>
    </ConfigurationProvider>
  );
}
