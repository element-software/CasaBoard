export { HAProvider } from "./provider/HAProvider";
export { useHA } from "./provider/HAProvider";
export { useEntity } from "./hooks/useEntity";
export { useEntities } from "./hooks/useEntities";
export { useEntityHistory } from "./hooks/useEntityHistory";
export { connect, getEntity, reauthenticateInstance } from "./connection";
export type { ConnectResult, EntityDomain, EntityId } from "./types";
export * from "./registry/localHARegistry";
export * from "./registry/mergeHAInstances";