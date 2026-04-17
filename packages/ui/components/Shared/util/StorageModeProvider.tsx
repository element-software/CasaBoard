"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type StorageMode = "local" | "cloud";

const STORAGE_MODE_KEY = "casaboard-storage-mode";
const ONBOARDED_KEY = "casaboard-onboarded";

interface StorageModeContextValue {
  /** The current storage mode for this device. `null` while hydrating. */
  storageMode: StorageMode | null;
  /** Whether the device has completed the onboarding flow. */
  isOnboarded: boolean;
  /** Persist the chosen storage mode and mark device as onboarded. */
  setStorageMode: (mode: StorageMode) => void;
  /** True while reading from localStorage (SSR / first paint). */
  isLoading: boolean;
}

const StorageModeContext = createContext<StorageModeContextValue>({
  storageMode: null,
  isOnboarded: false,
  setStorageMode: () => {},
  isLoading: true,
});

export function StorageModeProvider({ children }: { children: React.ReactNode }) {
  const [storageMode, setStorageModeState] = useState<StorageMode | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mode = localStorage.getItem(STORAGE_MODE_KEY) as StorageMode | null;
    const onboarded = localStorage.getItem(ONBOARDED_KEY) === "true";
    setStorageModeState(mode);
    setIsOnboarded(onboarded);
    setIsLoading(false);
  }, []);

  const setStorageMode = useCallback((mode: StorageMode) => {
    localStorage.setItem(STORAGE_MODE_KEY, mode);
    localStorage.setItem(ONBOARDED_KEY, "true");
    setStorageModeState(mode);
    setIsOnboarded(true);
  }, []);

  return (
    <StorageModeContext.Provider
      value={{ storageMode, isOnboarded, setStorageMode, isLoading }}
    >
      {children}
    </StorageModeContext.Provider>
  );
}

export function useStorageMode(): StorageModeContextValue {
  return useContext(StorageModeContext);
}
