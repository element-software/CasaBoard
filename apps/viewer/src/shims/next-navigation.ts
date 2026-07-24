export function usePathname(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

export function useRouter() {
  return {
    push: (href: string) => {
      window.location.href = href;
    },
    replace: (href: string) => {
      window.location.replace(href);
    },
    back: () => window.history.back(),
    refresh: () => window.location.reload(),
    prefetch: async () => {},
  };
}

export function useSearchParams() {
  return new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
}
