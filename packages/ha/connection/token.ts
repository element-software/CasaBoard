import { Encryption, generateSessionId, clientLogger, SupabaseClient, HAInstanceStorage } from "@repo/lib";
import { haTokenKey } from "@repo/lib";
import {
  AuthData,
  SaveTokensFunc,
} from "home-assistant-js-websocket";

async function getCurrentUser() {
  const supabase = SupabaseClient.createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export const saveTokensToLocalStorage: SaveTokensFunc = async (
  data: AuthData | null
) => {
  clientLogger.info("saveTokensToLocalStorage", "data", data);
  if (!data) {
    clientLogger.error("saveTokensToLocalStorage", "No data to save");
    return;
  }

  const instance = await HAInstanceStorage.getHAInstanceByHassUrl(data.hassUrl);
  clientLogger.info("saveTokensToLocalStorage", "instance", instance);
  if (!instance?.id) {
    clientLogger.error(
      "saveTokensToLocalStorage",
      "No instance found for hassUrl",
      data.hassUrl
    );
    return;
  }

  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      clientLogger.error("saveTokensToLocalStorage", "No authenticated user - tokens not saved");
      return;
    }
    const userId = user.id;
    const userEmail = user.email || undefined;

    // Re-use existing session_id if present to ensure stable decryption key
    const storageKey = haTokenKey(userId, instance.id);
    let existingSessionId: string | undefined;
    const prevRaw = localStorage.getItem(storageKey);
    if (prevRaw) {
      try {
        const prev = JSON.parse(prevRaw);
        if (prev?.encrypted && prev?.session_id) {
          existingSessionId = String(prev.session_id);
        }
      } catch {
        // ignore
      }
    }

    const sessionId = existingSessionId || generateSessionId(userId, userEmail);
    const plaintext = JSON.stringify(data);
    const cipher = await Encryption.encryptToken(plaintext, userId, sessionId);

    const payload = {
      encrypted: true,
      session_id: sessionId,
      value: cipher,
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
    clientLogger.info(
      "saveTokensToLocalStorage",
      "Encrypted auth saved to localStorage"
    );
  } catch (e) {
    clientLogger.error(
      "saveTokensToLocalStorage",
      "encryption failed - tokens not saved",
      e
    );
  }
};

export const loadTokensFromLocalStorage = async (
  instanceId: string
): Promise<AuthData | null> => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      clientLogger.error("loadTokensFromLocalStorage", "No authenticated user");
      return null;
    }
    const userId = user.id;
    const storageKey = haTokenKey(userId, instanceId);
    const raw = localStorage.getItem(storageKey);

    if (!raw) return null;

    const stored = JSON.parse(raw);

    if (
      typeof stored === "object" &&
      stored.encrypted &&
      stored.value &&
      stored.session_id
    ) {
      const sessionId = String(stored.session_id);
      const plaintext = await Encryption.decryptToken(
        String(stored.value),
        userId,
        sessionId
      );
      return JSON.parse(plaintext) as AuthData;
    }

    return stored as AuthData;
  } catch (e) {
    clientLogger.error(
      "loadTokensFromLocalStorage",
      "failed to load tokens",
      e
    );
    return null;
  }
};

export const clearTokenFromLocalStorage = async (
  instanceId: string
): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      clientLogger.warn("clearTokenFromLocalStorage", "No authenticated user - skipping clear");
      return;
    }
    const userId = user.id;
    const storageKey = haTokenKey(userId, instanceId);
    localStorage.removeItem(storageKey);
    clientLogger.info(
      "clearTokenFromLocalStorage",
      "Token cleared for instance",
      instanceId
    );
  } catch (e) {
    clientLogger.error(
      "clearTokenFromLocalStorage",
      "failed to clear token",
      e
    );
  }
};
