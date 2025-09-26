"use client";
import { HAInstanceActions, LinkService } from "@repo/lib";
import {
  getAuth,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  subscribeEntities,
  createLongLivedTokenAuth,
} from "home-assistant-js-websocket";
import type { Auth, AuthData, Connection } from "home-assistant-js-websocket";

export interface HassConnectProps {
  homeAssistantUrl: string;
}

export type ConnectResult = {
  connection: Connection;
  auth: Auth;
};

async function saveTokensToDB(data: AuthData | null): Promise<void> {
  if (data) {
    const first = await HAInstanceActions.getFirstHAInstance();
    if (!first?.id) {
      console.error("saveTokensToDB:: No first instance found");
      return;
    }
    console.log("saveTokensToDB:: Saving token to DB which expires in", data.expires_in);

    // create a long-lived token
    const longLivedToken = createLongLivedTokenAuth(data.hassUrl, data.access_token);
    console.log("saveTokensToDB:: created long-lived token", longLivedToken);

    const haInstance = await HAInstanceActions.updateHAInstance({
      id: first.id,
      hass_token: longLivedToken.accessToken,
    });

    if (haInstance?.hass_token) {
      console.log(
        "saveTokensToDB:: Token saved to DB",
        haInstance.hass_token.length
      );
    } else {
      console.error("saveTokensToDB:: Failed to save token to DB", haInstance);
    }
  } else {
    console.log("saveTokensToDB:: No token to save");
  }
}

async function loadTokensFromDB(): Promise<AuthData | null> {
  const first = await HAInstanceActions.getFirstHAInstance();
  console.log("loadTokensFromDB:: first", first);
  if (!first?.id) {
    console.error("loadTokensFromDB:: No first instance found");
    return null;
  }
  if (first?.hass_token) {
    console.log("loadTokensFromDB:: token found in DB", first.hass_token);
    return { access_token: first.hass_token, hassUrl: first.hass_url } as AuthData;
  } else {
    console.error("loadTokensFromDB:: No token found in DB", first);
  }
  return null;
}

export async function connect({
  homeAssistantUrl,
}: HassConnectProps): Promise<ConnectResult> {
  let auth: Auth;

  try {
    // Try to pick up authentication after user logs in
    console.log("connect:: trying to get auth");
    auth = await getAuth({
      hassUrl: homeAssistantUrl,
      saveTokens: saveTokensToDB,
      loadTokens: loadTokensFromDB,
      redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
    });
  } catch (err) {
    if (err === ERR_HASS_HOST_REQUIRED) {
      // Redirect user to log in on their instance
      console.log("connect:: redirecting to log in on their instance");
      auth = await getAuth({
        hassUrl: homeAssistantUrl,
        saveTokens: saveTokensToDB,
        loadTokens: loadTokensFromDB,
        redirectUrl: LinkService.crossAppHrefClient("app", "/setup/ha-config"),
      });
    } else {
      throw new Error(`Home Assistant auth failed: ${err}`);
    }
  }
  const connection = await createConnection({ auth });
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
