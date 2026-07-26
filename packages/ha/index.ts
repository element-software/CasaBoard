export { HAProvider } from "./provider/HAProvider";
export { useHA } from "./provider/HAProvider";
export { useEntity } from "./hooks/useEntity";
export { useEntities } from "./hooks/useEntities";
export { useEntityHistory } from "./hooks/useEntityHistory";
export { useAlarm } from "./hooks/useAlarm";
export type { UseAlarmOptions, UseAlarmResult } from "./hooks/useAlarm";
export type { EntityHistoryPoint } from "./hooks/entityHistory";
export { toChartDate } from "./hooks/entityHistory";
export {
  FORCE_ARM_DOMAINS,
  normalizeAlarmAction,
  isAlarmActive,
  resolveAlarmGestureAction,
  readArmExceptions,
  formatArmFailureMessage,
  serviceErrorMessage,
  getAlarmSecurityStatus,
  requiresAlarmCode,
  getAlarmPanelSnapshot,
  callAlarmService,
  forceArmAlarm,
  cancelForceArmAlarm,
  toAlarmCallFailure,
} from "./alarm/alarm";
export type {
  AlarmPanelService,
  AlarmAction,
  AlarmSecurityTone,
  AlarmSecurityStatus,
  AlarmArmFailure,
  AlarmPanelSnapshot,
  AlarmCallResult,
} from "./alarm/alarm";
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
