import { useCallback, useEffect, useMemo, useState } from "react";
import type { PublishedPagePayload } from "@repo/types/publishedPage";
import { DashboardNavProvider } from "@repo/ui/components/DashboardNav/DashboardNavContext";
import { usePathname } from "next/navigation";
import {
  mergeViewerChrome,
  StaticDashboard,
  type ViewerChrome,
} from "./StaticDashboard";
import { ViewerConnectForm } from "./ViewerConnectForm";
import {
  bindPopState,
  navigate,
  shouldClientNavigate,
} from "./clientHistory";
import {
  createLocalStorageTokenStore,
  HAProvider,
  useHA,
} from "./ha";

bindPopState();

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
  chrome,
  onNeedAuth,
}: {
  payload: PublishedPagePayload;
  chrome: ViewerChrome | null;
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

  return <StaticDashboard payload={payload} chrome={chrome} />;
}

export function ViewerApp() {
  const pathname = usePathname();
  const slug = useMemo(() => slugFromPathname(pathname), [pathname]);

  const [payload, setPayload] = useState<PublishedPagePayload | null>(null);
  const [chrome, setChrome] = useState<ViewerChrome | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean | null>(null);
  const [authEpoch, setAuthEpoch] = useState(0);
  const [navigating, setNavigating] = useState(false);

  const tokenStore = useMemo(() => createLocalStorageTokenStore(), []);

  const hrefForSlug = useCallback(
    (nextSlug: string) => hrefForPublishedSlug(nextSlug),
    // Recompute relative URLs when the path changes so ../ stays correct.
    [pathname]
  );

  // Soft-navigate plain same-origin anchors (defense in depth for non-Link markup).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!anchor.href) return;
      if (!shouldClientNavigate(event, anchor)) return;
      event.preventDefault();
      navigate(anchor.href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!slug) {
      setLoadError("Could not determine page slug from URL.");
      return;
    }

    let cancelled = false;
    const hasPayload = payload !== null;
    if (hasPayload) setNavigating(true);

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
        setChrome((prev) => mergeViewerChrome(prev, data));
        setLoadError(null);
        document.title = `CasaBoard — ${data.name || data.slug}`;

        const tokens = await Promise.resolve(tokenStore.loadTokens());
        setNeedsAuth((prev) => {
          // Don't bounce back to the auth form mid-session if tokens exist.
          if (prev === false && tokens?.access_token) return false;
          return !tokens?.access_token;
        });
      } catch (err) {
        if (!cancelled) {
          // Keep the prior dashboard visible on soft-nav failures.
          if (!hasPayload) {
            setLoadError(
              err instanceof Error ? err.message : "Failed to load page data"
            );
          } else {
            console.error(err);
          }
        }
      } finally {
        if (!cancelled) setNavigating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally depend on slug + tokenStore only — not payload.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when URL slug changes
  }, [slug, tokenStore]);

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
        <div className="relative">
          {navigating ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-theme-interactive-active/80"
            />
          ) : null}
          <ConnectedGate
            payload={payload}
            chrome={chrome}
            onNeedAuth={onNeedAuth}
          />
        </div>
      </HAProvider>
    </DashboardNavProvider>
  );
}
