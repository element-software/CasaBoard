import { HAInstanceActions } from "@repo/lib";
import {
  Auth,
  AuthData,
  createLongLivedTokenAuth,
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
  console.log(
    "saveTokensToDB:: Saving token to DB which expires in",
    data.expires_in,
  );

  const haInstance = await HAInstanceActions.updateHAInstance({
    id: first.id,
    hass_token: data.access_token,
    ha_refresh_token: data.refresh_token,
    expires_at: data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000).toISOString()
      : null as any,
  });

  if (haInstance?.hass_token) {
    console.log(
      "saveTokensToDB:: Token saved to DB",
      haInstance.hass_token.length
    );
  } else {
    console.error("saveTokensToDB:: Failed to save token to DB", haInstance);
  }
};

export const loadTokensFromDB: LoadTokensFunc = async () => {
  const first = await HAInstanceActions.getFirstHAInstance();
  console.log("loadTokensFromDB:: first", first);
  if (!first?.id) {
    console.error("loadTokensFromDB:: No first instance found");
    return null;
  }
  if (first?.hass_token) {
    console.log(
      "loadTokensFromDB:: token found in DB",
      first.hass_token.length
    );
    return {
      access_token: first.hass_token,
      hassUrl: first.hass_url,
    } as AuthData;
  } else {
    console.error("loadTokensFromDB:: No token found in DB", first);
  }
  return null;
};

export const refreshToken = async (auth: Auth) => {
  console.log("refreshToken:: refreshing token", auth);
  await auth.refreshAccessToken();
  console.log("refreshToken:: token refreshed", auth);
  return auth;
};

export const clearTokensInDB = async () => {
  const first = await HAInstanceActions.getFirstHAInstance();
  if (first?.id) {
    try {
      await HAInstanceActions.updateHAInstance({
        id: first.id,
        hass_token: null as any,
      });
      console.log("clearTokensInDB:: cleared token for instance", first.id);
    } catch (e) {
      console.warn("clearTokensInDB:: failed to clear token", e);
    }
  }
};
