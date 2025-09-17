import { ConfigurationProvider } from "@repo/ui/components/ConfigurationProvider";
import { HassConnectWrapper } from "@repo/ui/components/HassConnectWrapper";
import {
  UserSettingsActions,
  Encryption,
  ConfigService,
  getCurrentAuthUser,
} from "@repo/lib";
import { generateSessionId } from "@repo/lib";
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

  // Fetch user settings and decrypt token server-side
  const userSettings = await UserSettingsActions.getUserSettings();
  
  if (!userSettings) {
    redirect("/auth/login");
  }

  let decryptedToken: string | null = null;

  if (userSettings?.hass_token) {
    try {
      const user = await getCurrentAuthUser();

      if (user) {
        const sessionId = generateSessionId(user.id, user.email);

        if (Encryption.isEncrypted(userSettings.hass_token)) {
          decryptedToken = await Encryption.decryptToken(
            userSettings.hass_token,
            user.id,
            sessionId
          );
        } else {
          // Legacy plain text token
          decryptedToken = userSettings.hass_token;
        }
      } else {
        redirect("/auth/login");
      }
    } catch (error) {
      console.warn("Failed to decrypt HA token:", error);
      decryptedToken = null;
    }
  }

  return (
    <ConfigurationProvider initialConfig={initialConfig}>
      <HassConnectWrapper
        userSettings={userSettings}
        decryptedToken={decryptedToken}
      >
        <div className="min-h-screen bg-theme-background">{children}</div>
      </HassConnectWrapper>
    </ConfigurationProvider>
  );
}
