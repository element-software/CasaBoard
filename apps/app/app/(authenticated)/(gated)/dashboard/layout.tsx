import { ConfigurationProvider } from "@repo/ui/components/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/HassConnectWrapper";
import { HAInstanceActions, SupabaseServer, Encryption, ConfigService, getCurrentAuthUser } from "@repo/lib";
import { generateSessionId } from "@repo/lib";

// Force dynamic rendering for this layout since it uses cookies
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
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
        <HassConnectWrapper 
          haInstance={haInstance}
        >
          <div className="min-h-screen">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </HassConnectWrapper>
      </ConfigurationProvider>
  );
}
