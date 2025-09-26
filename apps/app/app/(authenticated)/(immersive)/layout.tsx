import { ConfigurationProvider } from "@repo/ui/components/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/HassConnectWrapper";
import { Header } from "@repo/ui/components/Header/Header";
import {
  HAInstanceActions,
  SupabaseServer,
  Encryption,
  ConfigService,
  getCurrentAuthUser,
} from "@repo/lib";
import { generateSessionId } from "@repo/lib";
import { Footer } from "@repo/ui/components/Footer";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch configuration server-side
  const initialConfig = await ConfigService.getServerConfig();

  // Fetch active instance and decrypt token server-side
  const haInstance = await HAInstanceActions.getActiveHAInstance();

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
