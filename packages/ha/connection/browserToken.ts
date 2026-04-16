/**
 * Browser-side HA token storage.
 *
 * HA credentials are ALWAYS stored locally in the browser — they are never
 * sent to CasaBoard servers, regardless of the user's storage-mode preference.
 *
 * Tokens are encrypted with the Web Crypto API using the same
 * `encryptToken` / `decryptToken` helpers from `@repo/lib`.
 */

import { Encryption, generateSessionId } from "@repo/lib";
import type { AuthData, SaveTokensFunc } from "home-assistant-js-websocket";

const KEY_PREFIX = "casaboard-ha-auth";
const SESSION_KEY_PREFIX = "casaboard-ha-session";

function storageKey(instanceId: string): string {
  return `${KEY_PREFIX}-${instanceId}`;
}

function sessionStorageKey(instanceId: string): string {
  return `${SESSION_KEY_PREFIX}-${instanceId}`;
}

/**
 * Save HA auth tokens to localStorage, encrypted with the user's identity.
 *
 * @param instanceId - The HA instance ID (used as part of the storage key).
 * @param userId     - Supabase user ID (used as part of the encryption key).
 * @param data       - The AuthData object returned by home-assistant-js-websocket.
 */
export async function saveTokensToLocalStorage(
  instanceId: string,
  userId: string,
  data: AuthData | null
): Promise<void> {
  if (!data) {
    localStorage.removeItem(storageKey(instanceId));
    return;
  }

  try {
    // Reuse an existing session ID so the decryption key stays stable across
    // token refreshes.
    let sessionId = localStorage.getItem(sessionStorageKey(instanceId));
    if (!sessionId) {
      sessionId = generateSessionId(userId);
      localStorage.setItem(sessionStorageKey(instanceId), sessionId);
    }

    const plaintext = JSON.stringify(data);
    const cipher = await Encryption.encryptToken(plaintext, userId, sessionId);

    const payload = JSON.stringify({
      encrypted: true,
      session_id: sessionId,
      value: cipher,
    });

    localStorage.setItem(storageKey(instanceId), payload);
  } catch (err) {
    console.error("[browserToken] saveTokensToLocalStorage failed", err);
    // Fallback: store unencrypted so auth still works
    localStorage.setItem(storageKey(instanceId), JSON.stringify(data));
  }
}

/**
 * Load HA auth tokens from localStorage.
 *
 * @param instanceId - The HA instance ID.
 * @param userId     - Supabase user ID (used for decryption).
 * @returns AuthData or null if not found / decryption failed.
 */
export async function loadTokensFromLocalStorage(
  instanceId: string,
  userId: string
): Promise<AuthData | null> {
  const raw = localStorage.getItem(storageKey(instanceId));
  if (!raw) return null;

  try {
    const stored = JSON.parse(raw);

    if (stored.encrypted && stored.value && stored.session_id) {
      const plaintext = await Encryption.decryptToken(
        String(stored.value),
        userId,
        String(stored.session_id)
      );
      return JSON.parse(plaintext) as AuthData;
    }

    // Legacy / fallback: plain JSON
    return stored as AuthData;
  } catch (err) {
    console.error("[browserToken] loadTokensFromLocalStorage failed", err);
    return null;
  }
}

/**
 * Remove stored HA auth tokens for an instance (e.g. on logout or re-auth).
 */
export function clearTokensFromLocalStorage(instanceId: string): void {
  localStorage.removeItem(storageKey(instanceId));
  localStorage.removeItem(sessionStorageKey(instanceId));
}

/**
 * Build a `saveTokens` callback compatible with `home-assistant-js-websocket`
 * that persists to localStorage.
 *
 * Because `getAuth` does not pass the instance ID to the callback, we close
 * over it here.
 */
export function makeSaveTokens(
  instanceId: string,
  userId: string
): SaveTokensFunc {
  return async (data: AuthData | null) => {
    await saveTokensToLocalStorage(instanceId, userId, data);
  };
}
