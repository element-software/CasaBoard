/**
 * Viewer-facing HA surface. Re-exports from @repo/ha plus long-lived token helper.
 */
export {
  HAProvider,
  useHA,
  createLocalStorageTokenStore,
  connect,
  classifyConnectionError,
  testLongLivedTokenConnection,
  type HATokenStore,
  type HAConnectionFailure,
} from "@repo/ha";
