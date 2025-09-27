import { HAInstanceActions, Encryption, generateSessionId, getCurrentAuthUser } from "@repo/lib";
import {
  Auth,
  AuthData,
  LoadTokensFunc,
  SaveTokensFunc,
} from "home-assistant-js-websocket";

export const saveTokensToDB: SaveTokensFunc = async (data: AuthData | null) => {
  if (!data) {
    console.error("saveTokensToDB:: No data to save");
    return;
  }

  const first = await HAInstanceActions.getFirstHAInstance();
  if (!first?.id) {
    console.error("saveTokensToDB:: No first instance found");
    return;
  }
  try {
    const user = await getCurrentAuthUser();
    const userId = user?.id || "anonymous";
    const userEmail = user?.email || undefined;

    // Re-use existing session_id if present to ensure stable decryption key
    let existingSessionId: string | undefined;
    const prevAuth: any = first?.auth;
    if (prevAuth && typeof prevAuth === "object" && prevAuth.encrypted && prevAuth.session_id) {
      existingSessionId = String(prevAuth.session_id);
    }

    const sessionId = existingSessionId || generateSessionId(userId, userEmail);

    const plaintext = JSON.stringify(data);
    const cipher = await Encryption.encryptToken(plaintext, userId, sessionId);

    const payload = {
      encrypted: true,
      session_id: sessionId,
      value: cipher,
    };

    const haInstance = await HAInstanceActions.updateHAInstance({
      id: first.id,
      auth: payload,
      expires_at: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null,
    });

    if (haInstance?.auth) {
      console.log("saveTokensToDB:: Encrypted auth saved to DB");
    } else {
      console.error("saveTokensToDB:: Failed to save encrypted auth to DB", haInstance);
    }
  } catch (e) {
    console.error("saveTokensToDB:: encryption failed, falling back to plain save", e);
    try {
      await HAInstanceActions.updateHAInstance({
        id: first.id,
        auth: data,
        expires_at: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000).toISOString()
          : null,
      });
    } catch (e2) {
      console.error("saveTokensToDB:: fallback save failed", e2);
    }
  }
};

export const loadTokensFromDB: LoadTokensFunc = async () => {
  const first = await HAInstanceActions.getFirstHAInstance();
  console.log("loadTokensFromDB:: first", first);
  if (!first?.id) {
    console.error("loadTokensFromDB:: No first instance found");
    return null;
  }
  try {
    const stored: any = first?.auth;
    if (!stored) {
      console.error("loadTokensFromDB:: No token found in DB", first);
      return null;
    }

    // If encrypted payload shape
    if (typeof stored === "object" && stored.encrypted && stored.value && stored.session_id) {
      const user = await getCurrentAuthUser();
      const userId = user?.id || "anonymous";
      const sessionId = String(stored.session_id);
      const plaintext = await Encryption.decryptToken(String(stored.value), userId, sessionId);
      const parsed = JSON.parse(plaintext) as AuthData;
      return parsed;
    }

    // Legacy formats: return as-is
    if (typeof stored === "string") {
      // If someone stored a raw token string erroneously, we cannot reconstruct AuthData
      console.warn("loadTokensFromDB:: Unexpected string auth format; returning null");
      return null;
    }
    return stored as AuthData;
  } catch (e) {
    console.error("loadTokensFromDB:: decryption failed", e);
    return null;
  }
};

