export { HAProvider } from "./provider/HAProvider";
export { useHA } from "./provider/HAProvider";
export { useEntity } from "./hooks/useEntity";
export { useEntities } from "./hooks/useEntities";
export { useEntityHistory } from "./hooks/useEntityHistory";
export type { EntityHistoryPoint } from "./hooks/entityHistory";
export { toChartDate } from "./hooks/entityHistory";
export {
  connect,
  getEntity,
  reauthenticate,
  createLocalStorageTokenStore,
  classifyConnectionError,
  haConnectionFailure,
  HAConnectionError,
  throwConnectionFailure,
  normalizeHassUrl,
  testLongLivedTokenConnection,
  completeOAuthCallback,
  isOAuthCallbackUrl,
  oauthRedirectUrl,
} from "./connection";
export type {
  HATokenStore,
  HAConnectProps,
  HAConnectionFailure,
  HAConnectionFailureCode,
  NormalizeHassUrlResult,
  TestLongLivedTokenResult,
} from "./connection";
export {
  CAMERA_FEATURE_STREAM,
  cameraSupportsHls,
  ensureFreshAccessToken,
  getCameraCapabilities,
  getCameraHlsUrl,
  getCameraMjpegUrl,
  getCameraPosterUrl,
  joinHassUrl,
} from "./camera/stream";
export type { CameraCapabilities, CameraStreamType } from "./camera/stream";
export type { ConnectResult, EntityDomain, EntityId, HAConnection } from "./types";
