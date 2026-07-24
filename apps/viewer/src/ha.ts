/**
 * Viewer-facing HA surface. Re-exports from @repo/ha plus long-lived token helper.
 */
export {
  HAProvider,
  useHA,
  createLocalStorageTokenStore,
  connect,
  type HATokenStore,
} from "@repo/ha";

export {
  createLongLivedTokenAuth,
  createConnection,
} from "home-assistant-js-websocket";
