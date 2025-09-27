import { HAInstanceActions } from "@repo/lib";
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
    console.log("saveTokensToDB:: Saving full auth object to DB", data);

  const haInstance = await HAInstanceActions.updateHAInstance({
    id: first.id,
      auth: data,
    expires_at: data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000).toISOString()
      : null,
  });

    if (haInstance?.auth) {
      console.log("saveTokensToDB:: Auth object saved to DB");
  } else {
      console.error("saveTokensToDB:: Failed to save auth to DB", haInstance);
  }
};

export const loadTokensFromDB: LoadTokensFunc = async () => {
  const first = await HAInstanceActions.getFirstHAInstance();
  console.log("loadTokensFromDB:: first", first);
  if (!first?.id) {
    console.error("loadTokensFromDB:: No first instance found");
    return null;
  }
    if (first?.auth) {
      console.log("loadTokensFromDB:: auth found in DB", first.auth);
      return first.auth as AuthData;
  } else {
    console.error("loadTokensFromDB:: No token found in DB", first);
  }
  return null;
};

