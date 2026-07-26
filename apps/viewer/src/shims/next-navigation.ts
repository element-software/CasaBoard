import { useCallback, useSyncExternalStore } from "react";
import {
  bindPopState,
  getPathname,
  navigate,
  subscribe,
} from "../clientHistory";

bindPopState();

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getPathname, () => "");
}

export function useRouter() {
  const push = useCallback((href: string) => {
    navigate(href);
  }, []);
  const replace = useCallback((href: string) => {
    navigate(href, { replace: true });
  }, []);
  const back = useCallback(() => {
    window.history.back();
  }, []);
  const refresh = useCallback(() => {
    window.location.reload();
  }, []);
  const prefetch = useCallback(async () => {}, []);

  return { push, replace, back, refresh, prefetch };
}

function getSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

export function useSearchParams() {
  const search = useSyncExternalStore(subscribe, getSearch, () => "");
  return new URLSearchParams(search);
}
