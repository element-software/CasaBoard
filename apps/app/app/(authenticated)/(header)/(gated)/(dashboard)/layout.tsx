import { ConfigurationProvider } from "@repo/ui/components/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/HassConnectWrapper";
import { UserSettingsActions, SupabaseServer, Encryption, ConfigService, getCurrentAuthUser } from "@repo/lib";
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
  
  // Fetch user settings and decrypt token server-side
  const userSettings = await UserSettingsActions.getUserSettings();
  let decryptedToken: string | null = null;
  
  if (userSettings?.hass_token) {
    try {
      const supabase = await SupabaseServer.createClient();
      const user = await getCurrentAuthUser();
      
      if (user) {
        const sessionId = generateSessionId(user.id, user.email);
        
        if (Encryption.isEncrypted(userSettings.hass_token)) {
          decryptedToken = await Encryption.decryptToken(userSettings.hass_token, user.id, sessionId);
        } else {
          // Legacy plain text token
          decryptedToken = userSettings.hass_token;
        }
      }
    } catch (error) {
      console.warn('Failed to decrypt HA token:', error);
      decryptedToken = null;
    }
  }

  return (
      <ConfigurationProvider initialConfig={initialConfig}>
        <HassConnectWrapper 
          userSettings={userSettings}
          decryptedToken={decryptedToken}
        >
          <div className="min-h-screen bg-theme-background">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </HassConnectWrapper>
      </ConfigurationProvider>
  );
}
