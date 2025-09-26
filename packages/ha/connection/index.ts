import { loadTokensFromDB, saveTokensToDB, clearTokensInDB } from './token';
import { LinkService } from "@repo/lib";
import {
  getAuth,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
} from "home-assistant-js-websocket";
import type { Auth, Connection } from "home-assistant-js-websocket";

export interface HassConnectProps {
  homeAssistantUrl: string;
}

export type ConnectResult = {
  connection: Connection;
  auth: Auth;
};


export async function connect({
  homeAssistantUrl,
}: HassConnectProps): Promise<ConnectResult> {

  let auth: Auth;
  let connection: Connection;

  try {
    // Try to pick up authentication after user logs in
    console.log("connect:: trying to get auth");
    auth = await getAuth({
      hassUrl: homeAssistantUrl,
      saveTokens: saveTokensToDB,
      loadTokens: loadTokensFromDB,
      redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
    });

    console.log("connect:: trying auth success", auth);
  } catch (err) {
    console.log("connect:: error", err);
    if (err === ERR_INVALID_AUTH) {
      // Tokens invalid: clear stored token and retry auth flow
      console.log("connect:: tokens invalid: retrying auth flow");
      auth = await getAuth({
        hassUrl: homeAssistantUrl,
        saveTokens: saveTokensToDB,
        loadTokens: loadTokensFromDB,
        redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
      });
    } else if (err === ERR_HASS_HOST_REQUIRED) {
      // Redirect user to log in on their instance
      console.log("connect:: redirecting to log in on their instance");
      auth = await getAuth({
        hassUrl: homeAssistantUrl,
        saveTokens: saveTokensToDB,
        loadTokens: loadTokensFromDB,
        redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
      });
      console.log("connect:: auth after redirect", auth);
    } else {
      throw new Error(`Home Assistant auth failed: ${err}`);
    }
  }
  // Optional: add basic connection event logging
  // connection.addEventListener("ready", () => console.log("HA connection ready"));
  // connection.addEventListener("disconnected", () => console.log("HA connection disconnected"));
  // connection.addEventListener("reconnect-error", () => console.warn("HA connection reconnect error"));

  try {
    connection = await createConnection({ auth });
  } catch (err) {
    if (err === ERR_INVALID_AUTH) {
      console.error("connect:: tokens invalid: retrying auth flow");
    } 
    if (err === ERR_CANNOT_CONNECT) {
      console.error("connect:: cannot connect: retrying auth flow");
    }
    
    console.error("connect:: error", err);
    throw new Error(`create connection failed: ${err}`);
  }
  return { connection, auth };
}

function normalizeNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_\.]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export type EntityDomain =
  | "light"
  | "switch"
  | "cover"
  | "sensor"
  | "binary_sensor"
  | "climate"
  | "media_player"
  | "lock"
  | "fan"
  | string;

export type EntityId = string;

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
) {
  const entityId = buildEntityId(name, domain);
  const states = (await connection.sendMessagePromise({
    type: "get_states",
  })) as Array<{
    entity_id: string;
    [key: string]: any;
  }>;
  return states.find((s) => s.entity_id === entityId) ?? null;
}
