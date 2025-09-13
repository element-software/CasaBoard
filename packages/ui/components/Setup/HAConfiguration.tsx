"use client";
import { useState, useEffect, useTransition } from "react";
import { UserSettingsActions, Encryption, SupabaseClient } from "@repo/lib";
import { UserSettings } from "@repo/types/userSettings";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Switch,
} from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiHomeAssistant,
  mdiCheck,
  mdiAlert,
  mdiLoading,
  mdiPencil,
  mdiCheckCircle,
  mdiDelete,
} from "@mdi/js";
import { useRouter } from "next/navigation";

interface HAConfigurationProps {
  compact?: boolean;
  minimal?: boolean; // New prop for minimal view without card wrapper
}

export const HAConfiguration = ({
  compact = false,
  minimal = false,
}: HAConfigurationProps) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [isEditing, setIsEditing] = useState(false);
  const [userSession, setUserSession] = useState<{
    userId: string;
    sessionId: string;
  } | null>(null);
  const router = useRouter();
  const supabase = SupabaseClient.createClient();

  const [formData, setFormData] = useState({
    hass_url: "",
    hass_token: "",
  });

  useEffect(() => {
    initializeUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = async () => {
    startTransition(async () => {
      try {
        await UserSettingsActions.deleteUserHassSettings();
        router.replace("/setup/ha-config");
      } catch (e: any) {
        setError(e?.message || "Failed to delete settings");
      }
    });
  };

  const initializeUserSession = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const sessionId = Encryption.generateSessionId(user.id, user.email);
        setUserSession({ userId: user.id, sessionId });
        loadSettings(user.id, sessionId);
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to get user session");
      setLoading(false);
    }
  };

  const loadSettings = async (userId: string, sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userSettings = await UserSettingsActions.getUserSettings();
      setSettings(userSettings);

      if (userSettings) {
        let decryptedToken = "";

        // Decrypt token if it's encrypted
        if (userSettings.hass_token) {
          if (Encryption.isEncrypted(userSettings.hass_token)) {
            try {
              decryptedToken = await Encryption.decryptToken(
                userSettings.hass_token,
                userId,
                sessionId
              );
            } catch (decryptError) {
              console.error("Failed to decrypt token:", decryptError);
              decryptedToken = ""; // Clear invalid token
            }
          } else {
            // Legacy plain text token - keep as is for now
            decryptedToken = userSettings.hass_token;
          }
        }

        setFormData({
          hass_url: userSettings.hass_url || "",
          hass_token: decryptedToken,
        });

        // If we have both URL and token, we're connected
        if (userSettings.hass_url && decryptedToken) {
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } else {
        setIsEditing(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userSession) {
      setError("User session not available");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        // Encrypt the token before saving
        const encryptedToken = formData.hass_token
          ? await Encryption.encryptToken(
              formData.hass_token,
              userSession.userId,
              userSession.sessionId
            )
          : "";

        const dataToSave = {
          hass_url: formData.hass_url,
          hass_token: encryptedToken,
        };

        const updatedSettings =
          await UserSettingsActions.updateUserSettings(dataToSave);
        setSettings(updatedSettings);
        setConnectionStatus("success");
        setIsEditing(false); // Exit editing mode after successful save
        setTimeout(() => setConnectionStatus("idle"), 3000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save settings"
        );
        setConnectionStatus("error");
      }
    });
  };

  const testConnection = async () => {
    if (!formData.hass_url || !formData.hass_token) {
      setError("Please enter both HA URL and token");
      return;
    }

    if (!userSession) {
      setError("User session not available");
      return;
    }

    setConnectionStatus("testing");
    setError(null);

    // Save settings before testing (with encryption)
    try {
      const encryptedToken = await Encryption.encryptToken(
        formData.hass_token,
        userSession.userId,
        userSession.sessionId
      );

      const dataToSave = {
        hass_url: formData.hass_url,
        hass_token: encryptedToken,
      };

      const updatedSettings =
        await UserSettingsActions.updateUserSettings(dataToSave);
      setSettings(updatedSettings);
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
      return;
    }
    router.push("/ha-test");
  };

  if (loading) {
    if (minimal) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <Icon
              path={mdiLoading}
              className="w-6 h-6 animate-spin mx-auto mb-2 text-theme-primary"
            />
            <p className="text-theme-text-secondary text-sm">
              Loading HA configuration...
            </p>
          </div>
        </div>
      );
    }

    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="text-center">
            <Icon
              path={mdiLoading}
              className="w-8 h-8 animate-spin mx-auto mb-2 text-theme-primary"
            />
            <p className="text-theme-text-secondary">
              Loading HA configuration...
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Check if we have a valid connection
  const isConnected = settings?.hass_url && settings?.hass_token;

  // Minimal view - just the green box with buttons, no card wrapper
  if (minimal && compact && isConnected && !isEditing) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon path={mdiCheckCircle} className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Connected to Home Assistant
            </span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              <strong>URL:</strong> {settings.hass_url}
            </p>
            <p>
              <strong>Authentication:</strong> Long-lived token configured
            </p>
            <p>Your HA instance is ready for use in dashboard pages.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="solid"
            onPress={() => router.push("/ha-test")}
            startContent={<Icon path={mdiCheck} className="w-4 h-4" />}
          >
            Test Connection
          </Button>
          <Button
            color="danger"
            onPress={handleReset}
            isLoading={isPending}
            startContent={<Icon path={mdiDelete} className="w-4 h-4" />}
          >
            Delete Configuration
          </Button>
          <Button
            variant="bordered"
            onPress={() => router.push("/setup/ha-config")}
            startContent={<Icon path={mdiPencil} className="w-4 h-4" />}
          >
            Edit Configuration
          </Button>
        </div>

        {connectionStatus === "success" && (
          <div className="text-sm text-green-600">
            <p>Configuration saved successfully!</p>
            <p>Your HA instance will be used for all dashboard pages.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            path={mdiHomeAssistant}
            className="w-6 h-6 text-theme-primary"
          />
          <h3 className="text-lg font-semibold text-theme-text">
            {compact ? "Home Assistant" : "Home Assistant Configuration"}
          </h3>
          {isConnected && !isEditing && (
            <Icon path={mdiCheckCircle} className="w-5 h-5 text-green-500" />
          )}
          {connectionStatus === "success" && (
            <Icon path={mdiCheck} className="w-5 h-5 text-green-500" />
          )}
          {connectionStatus === "error" && (
            <Icon path={mdiAlert} className="w-5 h-5 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {compact && isConnected && !isEditing ? (
          // Connected state - show connection info
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  path={mdiCheckCircle}
                  className="w-5 h-5 text-green-600"
                />
                <span className="font-semibold text-green-800">
                  Connected to Home Assistant
                </span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  <strong>URL:</strong> {settings.hass_url}
                </p>
                <p>
                  <strong>Authentication:</strong> Long-lived token configured
                </p>
                <p>Your HA instance is ready for use in dashboard pages.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="solid"
                onPress={() => router.push("/ha-test")}
                startContent={<Icon path={mdiCheck} className="w-4 h-4" />}
              >
                Test Connection
              </Button>
              {compact && isConnected && !isEditing && (
                <Button
                  variant="bordered"
                  onPress={() =>
                    compact
                      ? router.push("/setup/ha-config")
                      : setIsEditing(true)
                  }
                  startContent={<Icon path={mdiPencil} className="w-4 h-4" />}
                >
                  Edit Configuration
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Editing state - show input fields
          <div className="space-y-4">
            <div className="space-y-3">
              <Input
                label="Home Assistant URL"
                placeholder="http://homeassistant.local:8123"
                value={formData.hass_url}
                onChange={(e) =>
                  setFormData({ ...formData, hass_url: e.target.value })
                }
                description="Enter your Home Assistant URL (e.g., http://homeassistant.local:8123)"
              />

              <Input
                label="Long-lived Access Token"
                type="password"
                placeholder="Enter your HA long-lived token"
                value={formData.hass_token}
                onChange={(e) =>
                  setFormData({ ...formData, hass_token: e.target.value })
                }
                description="Generate a long-lived access token in HA Profile settings"
              />

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <p>
                  <strong>Token Authentication:</strong> Use a long-lived access
                  token for reliable authentication with Home Assistant.
                </p>
                <p className="mt-1">
                  Generate a token in Home Assistant: Profile → Long-lived
                  access tokens → Create token
                </p>
                <p className="mt-1">
                  <strong>Test Connection:</strong> Click &quot;Test
                  Connection&quot; to verify your URL and token work correctly.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                color="primary"
                onPress={handleSave}
                isLoading={isPending}
                isDisabled={!formData.hass_url || !formData.hass_token}
              >
                Save Configuration
              </Button>

              <Button
                variant="bordered"
                onPress={testConnection}
                isLoading={connectionStatus === "testing"}
                isDisabled={!formData.hass_url || !formData.hass_token}
              >
                Test Connection
              </Button>
            </div>

            {compact && isConnected && (
              <Button
                variant="light"
                onPress={() => setIsEditing(false)}
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {connectionStatus === "success" && (
          <div className="text-sm text-green-600">
            <p>Configuration saved successfully!</p>
            <p>Your HA instance will be used for all dashboard pages.</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
