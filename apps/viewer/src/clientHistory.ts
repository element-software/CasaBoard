type Listener = () => void;

const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getPathname(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when this click should soft-navigate (same-tab, unmodified, same-origin). */
export function shouldClientNavigate(
  event: Pick<MouseEvent, "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "button" | "defaultPrevented">,
  anchor: Pick<HTMLAnchorElement, "target" | "href" | "origin" | "hasAttribute">
): boolean {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    // Ignore hash-only changes on the same path.
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function navigate(
  href: string,
  options: { replace?: boolean } = {}
): void {
  if (typeof window === "undefined") return;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) {
    window.location.href = href;
    return;
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) {
    notify();
    return;
  }

  if (options.replace) {
    window.history.replaceState(window.history.state, "", next);
  } else {
    window.history.pushState(window.history.state, "", next);
  }
  notify();
}

let popstateBound = false;

/** Bind once so browser back/forward updates subscribers. */
export function bindPopState(): void {
  if (typeof window === "undefined" || popstateBound) return;
  popstateBound = true;
  window.addEventListener("popstate", notify);
}
