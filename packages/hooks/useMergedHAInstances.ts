"use client";

import { useCallback, useEffect, useState } from "react";
import type { HAInstance } from "@repo/types/ha";
import type { Entitlements } from "@repo/types/subscription";
import {
  HAInstanceActions,
  UserSettingsActions,
} from "@repo/lib";
import {
  listLocalRegistry,
  mergeRegistryWithCloud,
  toHAInstance,
} from "@repo/ha";

export function useMergedHAInstances(entitlements: Entitlements | null) {
  const [instances, setInstances] = useState<HAInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!entitlements) {
      setInstances([]);
      setLoading(false);
      return;
    }

    const local = listLocalRegistry();
    let cloud: {
      id: string;
      name: string;
      hass_url: string;
      created_at?: string;
    }[] = [];

    const cloudPref = await UserSettingsActions.getHaCloudSyncPreference();
    const applyCloud =
      entitlements.haCloudSync && cloudPref && entitlements.active;

    if (applyCloud) {
      try {
        cloud = await HAInstanceActions.listHAInstances();
      } catch {
        cloud = [];
      }
    }

    const merged = mergeRegistryWithCloud(local, cloud, !!applyCloud);
    setInstances(merged.map(toHAInstance));
    setLoading(false);
  }, [entitlements]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onChange = () => void refresh();
    window.addEventListener("casaboard-ha-registry-changed", onChange);
    return () =>
      window.removeEventListener("casaboard-ha-registry-changed", onChange);
  }, [refresh]);

  return { instances, loading, refresh };
}
