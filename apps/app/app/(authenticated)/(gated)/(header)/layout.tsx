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
import { Header } from "@repo/ui/components/Header/Header";
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

  // Ensure user is authenticated first
  const authedUser = await getCurrentAuthUser();
  if (!authedUser) {
    redirect("/auth/login?redirectTo=/setup");
  }

  // Fetch user settings and decrypt token server-side
  const userSettings = await UserSettingsActions.getUserSettings();

  let decryptedToken: string | null = null;

  if (userSettings?.hass_token) {
    try {
      if (authedUser) {
        const sessionId = generateSessionId(authedUser.id, authedUser.email);

        if (Encryption.isEncrypted(userSettings.hass_token)) {
          decryptedToken = await Encryption.decryptToken(
            userSettings.hass_token,
            authedUser.id,
            sessionId
          );
        } else {
          // Legacy plain text token
          decryptedToken = userSettings.hass_token;
        }
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
        <Header user={authedUser} />
        <div className="min-h-screen bg-theme-background">
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
      </HassConnectWrapper>
    </ConfigurationProvider>
  );
}
