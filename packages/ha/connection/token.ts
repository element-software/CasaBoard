import { HAInstanceActions, Encryption, generateSessionId, getCurrentAuthUser, serverLogger } from "@repo/lib";
import {
  Auth,
  AuthData,
  LoadTokensFunc,
  SaveTokensFunc,
} from "home-assistant-js-websocket";

export const saveTokensToDB: SaveTokensFunc = async (data: AuthData | null, instanceId?: string) => {
  if (!data) {
    serverLogger.error('saveTokensToDB', 'No data to save');
    return;
  }

  let instance;
  if (instanceId) {
    instance = await HAInstanceActions.getHAInstance(instanceId);
  } else {
    instance = await HAInstanceActions.getFirstHAInstance();
  }
  
  if (!instance?.id) {
    serverLogger.error('saveTokensToDB', 'No instance found');
    return;
  }
  try {
    const user = await getCurrentAuthUser();
    const userId = user?.id || "anonymous";
    const userEmail = user?.email || undefined;

    // Re-use existing session_id if present to ensure stable decryption key
    let existingSessionId: string | undefined;
    const prevAuth: any = instance?.auth;
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
      id: instance.id,
      auth: payload,
      expires_at: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null,
    });

    if (haInstance?.auth) {
      serverLogger.info('saveTokensToDB', 'Encrypted auth saved to DB');
    } else {
      serverLogger.error('saveTokensToDB', 'Failed to save encrypted auth to DB', haInstance);
    }
  } catch (e) {
    serverLogger.error('saveTokensToDB', 'encryption failed, falling back to plain save', e);
    try {
      await HAInstanceActions.updateHAInstance({
        id: instance.id,
        auth: data,
        expires_at: data.expires_in
          ? new Date(Date.now() + data.expires_in * 1000).toISOString()
          : null,
      });
    } catch (e2) {
      serverLogger.error('saveTokensToDB', 'fallback save failed', e2);
    }
  }
};

export const loadTokensFromDB: LoadTokensFunc = async (instanceId?: string) => {
  let instance;
  if (instanceId) {
    instance = await HAInstanceActions.getHAInstance(instanceId);
  } else {
    instance = await HAInstanceActions.getFirstHAInstance();
  }
  
  serverLogger.info('loadTokensFromDB', 'instance', instance);
  if (!instance?.id) {
    serverLogger.error('loadTokensFromDB', 'No instance found');
    return null;
  }
  try {
    const stored: any = instance?.auth;
    if (!stored) {
      serverLogger.error('loadTokensFromDB', 'No token found in DB', instance);
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
      serverLogger.warn('loadTokensFromDB', 'Unexpected string auth format; returning null');
      return null;
    }
    return stored as AuthData;
  } catch (e) {
    serverLogger.error('loadTokensFromDB', 'decryption failed', e);
    return null;
  }
};

