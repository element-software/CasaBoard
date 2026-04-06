import {
  haInstancesKey,
  pagesKey,
  sidebarsKey,
  STORAGE_PREFIX,
} from "./storageKeys";
import { getCurrentUserId, readFromStorage, writeToStorage } from "./storageUtils";
import { clientLogger } from "../logger";

interface ExportData {
  version: 1;
  exportedAt: string;
  userId: string;
  data: {
    ha_instances: unknown[];
    pages: unknown[];
    sidebars: unknown[];
  };
}

/**
 * Export all localStorage data for the current user as a JSON object.
 * Tokens are intentionally excluded because they contain encrypted credentials
 * that are tied to the current browser session key.
 */
export async function exportUserData(): Promise<ExportData> {
  const userId = await getCurrentUserId();

  const ha_instances = readFromStorage<unknown[]>(haInstancesKey(userId)) ?? [];
  const pages = readFromStorage<unknown[]>(pagesKey(userId)) ?? [];
  const sidebars = readFromStorage<unknown[]>(sidebarsKey(userId)) ?? [];

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    userId,
    data: { ha_instances, pages, sidebars },
  };
}

/**
 * Trigger a file download of the exported user data.
 */
export async function downloadUserData(): Promise<void> {
  const exportData = await exportUserData();
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `casaboard-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import previously exported user data into localStorage.
 * Existing data for the current user will be overwritten.
 */
export async function importUserData(json: string): Promise<void> {
  const currentUserId = await getCurrentUserId();
  let importData: ExportData;

  try {
    importData = JSON.parse(json) as ExportData;
  } catch {
    throw new Error("Invalid backup file: could not parse JSON.");
  }

  if (importData.version !== 1) {
    throw new Error("Unsupported backup version.");
  }

  if (!importData.data) {
    throw new Error("Invalid backup file: missing data section.");
  }

  if (importData.userId && importData.userId !== currentUserId) {
    // Warn but allow import — users may intentionally restore a backup from
    // a different account (e.g., after an email change or account migration)
    clientLogger.warn(
      "DataPortability",
      `Backup userId (${importData.userId}) differs from current userId (${currentUserId}). Proceeding with import.`
    );
  }

  const { ha_instances = [], pages = [], sidebars = [] } = importData.data;

  writeToStorage(haInstancesKey(currentUserId), ha_instances);
  writeToStorage(pagesKey(currentUserId), pages);
  writeToStorage(sidebarsKey(currentUserId), sidebars);
}

/**
 * Remove all CasaBoard data for the current user from localStorage.
 */
export async function clearUserData(): Promise<void> {
  const userId = await getCurrentUserId();
  localStorage.removeItem(haInstancesKey(userId));
  localStorage.removeItem(pagesKey(userId));
  localStorage.removeItem(sidebarsKey(userId));

  // Also clear any token keys for this user
  const tokenPrefix = `${STORAGE_PREFIX}:${userId}:ha:tokens:`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(tokenPrefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
