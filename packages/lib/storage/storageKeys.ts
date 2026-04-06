export const STORAGE_PREFIX = "casaboard";

export function haInstancesKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}:ha_instances`;
}

export function pagesKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}:pages`;
}

export function sidebarsKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}:sidebars`;
}

export function haTokenKey(userId: string, instanceId: string): string {
  return `${STORAGE_PREFIX}:${userId}:ha:tokens:${instanceId}`;
}
