import { ConnectResult, EntityDomain, EntityId } from "../types/index";
import { serverLogger, HAConnectionActions } from "@repo/lib";
import { LinkService } from "@repo/lib";
import {
  getAuth,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
} from "home-assistant-js-websocket";
import type {
  Auth,
  AuthData,
  Connection,
  LoadTokensFunc,
  SaveTokensFunc,
} from "home-assistant-js-websocket";
import { HAConnection } from "@repo/types/ha";

export interface HAConnectProps {
  haInstance: HAConnection;
}

function normalizeNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\.]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function buildEntityId(name: string, domain: EntityDomain): EntityId {
  const normalizedDomain = String(domain).trim().toLowerCase();
  const normalizedName = normalizeNameToSlug(name);
  if (normalizedName.includes(".")) {
    return normalizedName as EntityId;
  }
  return `${normalizedDomain}.${normalizedName}`;
}

export async function getEntity(
  name: string,
  domain: EntityDomain,
  connection: Connection
): Promise<any> {
  const entityId = buildEntityId(name, domain);
  const states = (await connection.sendMessagePromise({
    type: "get_states",
  })) as Array<{
    entity_id: string;
    [key: string]: any;
  }>;
  return states.find((s) => s.entity_id === entityId) ?? null;
}

function makeSaveTokens(hass_url: string): SaveTokensFunc {
  return async (data: AuthData | null) => {
    await HAConnectionActions.saveHAConnection(hass_url, data);
  };
}

async function loadTokens(): Promise<AuthData | null> {
  return HAConnectionActions.getHAAuthData();
}

export async function connect({
  haInstance,
}: HAConnectProps): Promise<ConnectResult> {
  let auth: Auth | undefined;
  let connection: Connection | undefined;

  const getAuthOptions = {
    hassUrl: haInstance.hass_url,
    saveTokens: makeSaveTokens(haInstance.hass_url),
    loadTokens: loadTokens as unknown as LoadTokensFunc,
    redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
  };

  // Try to get auth, retry if invalid or host required
  try {
    auth = await getAuth(getAuthOptions);
    serverLogger.info("connect", "got auth", auth);
  } catch (err) {
    serverLogger.warn("connect", "getAuth error", err);
    if (err === ERR_INVALID_AUTH || err === ERR_HASS_HOST_REQUIRED) {
      try {
        auth = await getAuth(getAuthOptions);
        serverLogger.info("connect", "retried getAuth", auth);
      } catch (err2) {
        serverLogger.error("connect", "getAuth failed after retry", err2);
        throw new Error(`Home Assistant auth failed: ${err2}`);
      }
    } else {
      throw new Error(`Home Assistant auth failed: ${err}`);
    }
  }

  // Try to create connection
  try {
    if (!auth) throw new Error("No auth available for connection");
    connection = await createConnection({ auth });
  } catch (err) {
    serverLogger.error("connect", "createConnection error", err);
    throw new Error(`Home Assistant connection failed: ${err}`);
  }

  return { connection, auth };
}

/**
 * Re-authenticates the single Home Assistant connection.
 * Forces a fresh OAuth flow instead of reusing the stored token, but keeps
 * the stored hass_url so the flow resumes automatically after redirect-back.
 */
export async function reauthenticate({
  haInstance,
}: HAConnectProps): Promise<void> {
  let auth: Auth | undefined;

  const getAuthOptions = {
    hassUrl: haInstance.hass_url,
    saveTokens: makeSaveTokens(haInstance.hass_url),
    loadTokens: (async () => null) as unknown as LoadTokensFunc,
    redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
  };

  try {
    auth = await getAuth(getAuthOptions);
    serverLogger.info("reauthenticate", "got new auth");
  } catch (err) {
    serverLogger.error("reauthenticate", "getAuth error", err);
    throw new Error(`Home Assistant re-authentication failed: ${err}`);
  }
}
