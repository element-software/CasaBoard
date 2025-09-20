import { UserSettingsActions } from "@repo/lib";
import { UserSettings } from "@repo/types/userSettings";
import Icon from "@mdi/react";
import { mdiAlertCircle } from "@mdi/js";
import { TestPage } from "./testpage";

// Enable dynamic params for unknown routes
export const dynamicParams = true;
// Force dynamic rendering since pages are stored in Supabase
export const dynamic = "force-dynamic";

export default async function HATestPage() {
  let settings: UserSettings | null = null;
  let error: string | null = null;

  try {
    settings = await UserSettingsActions.getUserSettings();

    if (!settings?.hass_url || !settings?.hass_token) {
      error =
        "No Home Assistant URL or token configured. Please go back to setup and configure your HA settings.";
    }
  } catch (err) {
    error = "Failed to load HA settings";
  }

  if (error || !settings?.hass_url || !settings?.hass_token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <Icon
            path={mdiAlertCircle}
            className="w-16 h-16 text-red-500 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-theme-text mb-2">
            Configuration Error
          </h1>
          <p className="text-theme-text-secondary mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <TestPage settings={settings} />
  );
}
