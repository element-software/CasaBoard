import { ConfigurationProvider } from "@repo/ui/components/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/HassConnectWrapper";
import { Header } from "@repo/ui/components/Header/Header";
import {
  HAInstanceActions,
  SupabaseServer,
  Encryption,
  ConfigService,
  getCurrentAuthUser,
  serverLogger,
} from "@repo/lib";
import { generateSessionId } from "@repo/lib";
import { Footer } from "@repo/ui/components/Footer";
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

  // On first login, ensure a 14-day mid plan trial exists
  try {
    const { SubscriptionService } = await import("@repo/lib");
    await SubscriptionService.ensureTrialOnFirstLogin();
  } catch {
    serverLogger.error("Layout (immersive)::", "Failed to ensure trial on first login");
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
