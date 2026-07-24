import { useCallback, useEffect, useMemo, useState } from "react";
import type { PublishedPagePayload } from "@repo/types/publishedPage";
import { DashboardNavProvider } from "@repo/ui/components/DashboardNav/DashboardNavContext";
import { StaticDashboard } from "./StaticDashboard";
import { ViewerConnectForm } from "./ViewerConnectForm";
import {
  createLocalStorageTokenStore,
  HAProvider,
  useHA,
} from "./ha";

function slugFromPathname(pathname: string): string | null {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return parts[parts.length - 1] ?? null;
}

function pageJsonUrl(slug: string): string {
  return new URL(`../pages/${slug}.json`, window.location.href).href;
}

function hrefForPublishedSlug(slug: string): string {
  return new URL(`../${slug}/`, window.location.href).href;
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-8 text-theme-text-secondary">
      {message}
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="max-w-md rounded-lg border border-red-300 bg-red-50 p-6 text-red-800">
        <h1 className="mb-2 text-lg font-semibold">Unable to load dashboard</h1>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

function ConnectedGate({
  payload,
  onNeedAuth,
}: {
  payload: PublishedPagePayload;
  onNeedAuth: () => void;
}) {
  const { loading, error, connected } = useHA();

  useEffect(() => {
    if (!loading && (error || !connected)) {
      onNeedAuth();
    }
  }, [loading, error, connected, onNeedAuth]);

  if (loading) {
    return <LoadingScreen message="Connecting to Home Assistant…" />;
  }

  if (error || !connected) {
    return <LoadingScreen message="Waiting for Home Assistant…" />;
  }

  return <StaticDashboard payload={payload} />;
}

export function ViewerApp() {
  const [payload, setPayload] = useState<PublishedPagePayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean | null>(null);
  const [authEpoch, setAuthEpoch] = useState(0);

  const tokenStore = useMemo(() => createLocalStorageTokenStore(), []);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const hrefForSlug = useCallback(
    (slug: string) => hrefForPublishedSlug(slug),
    []
  );

  useEffect(() => {
    const slug = slugFromPathname(window.location.pathname);
    if (!slug) {
      setLoadError("Could not determine page slug from URL.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(pageJsonUrl(slug), { cache: "no-store" });
        if (!res.ok) {
          throw new Error(
            `Failed to load pages/${slug}.json (${res.status}). Is this page published?`
          );
        }
        const data = (await res.json()) as PublishedPagePayload;
        if (cancelled) return;
        setPayload(data);

        const tokens = await Promise.resolve(tokenStore.loadTokens());
        setNeedsAuth(!tokens?.access_token);
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load page data"
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tokenStore]);

  const onAuthSaved = useCallback(() => {
    setNeedsAuth(false);
    setAuthEpoch((n) => n + 1);
  }, []);

  const onNeedAuth = useCallback(() => {
    setNeedsAuth(true);
  }, []);

  if (loadError) return <ErrorScreen message={loadError} />;
  if (!payload || needsAuth === null) {
    return <LoadingScreen message="Loading dashboard…" />;
  }

  if (needsAuth) {
    return (
      <ViewerConnectForm
        hassUrl={payload.hassUrl}
        tokenStore={tokenStore}
        onConnected={onAuthSaved}
      />
    );
  }

  const haInstance = { hass_url: payload.hassUrl };
  const redirectUrl =
    typeof window !== "undefined" ? window.location.href : undefined;

  return (
    <DashboardNavProvider hrefForSlug={hrefForSlug} pathname={pathname}>
      <HAProvider
        key={authEpoch}
        haInstance={haInstance}
        tokenStore={tokenStore}
        redirectUrl={redirectUrl}
      >
        <ConnectedGate payload={payload} onNeedAuth={onNeedAuth} />
      </HAProvider>
    </DashboardNavProvider>
  );
}
