import { ConnectResult, EntityDomain, EntityId } from "../types/index";
import { serverLogger } from "@repo/lib";
import { loadTokensFromDB, saveTokensToDB } from "./token";
import { LinkService } from "@repo/lib";
import {
  getAuth,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
} from "home-assistant-js-websocket";
import type {
  Auth,
  AuthData,
  Connection,
  LoadTokensFunc,
} from "home-assistant-js-websocket";
import { HAInstance } from "@repo/types/ha";

export interface HAConnectProps {
  haInstance: HAInstance;
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

export async function connect({
  haInstance,
}: HAConnectProps): Promise<ConnectResult> {
  let auth: Auth | undefined;
  let connection: Connection | undefined;

  const loadTokens = async () => {
    serverLogger.info("loadTokens wrapper", "haInstance", haInstance);
    return loadTokensFromDB(haInstance.id) as unknown as AuthData;
  };

  const getAuthOptions = {
    hassUrl: haInstance.hass_url,
    saveTokens: saveTokensToDB,
    loadTokens: loadTokens as unknown as LoadTokensFunc,
    redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
  };

  // Try to get auth, retry if invalid or host requiredS
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
    // Optionally add connection event logging
    // connection.addEventListener("ready", () => serverLogger.info('connect', 'HA connection ready'));
    // connection.addEventListener("disconnected", () => serverLogger.info('connect', 'HA connection disconnected'));
    // connection.addEventListener("reconnect-error", () => serverLogger.warn('connect', 'HA connection reconnect error'));
  } catch (err) {
    serverLogger.error("connect", "createConnection error", err);
    throw new Error(`Home Assistant connection failed: ${err}`);
  }

  return { connection, auth };
}
