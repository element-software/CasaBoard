/** Minimal @repo/lib shim for the static Vite viewer. */

const noop = () => {};

function makeLogger() {
  return {
    info: (fn: string, msg: unknown, ...args: unknown[]) => {
      console.info(`[viewer] ${fn}:`, msg, ...args);
    },
    warn: (fn: string, msg: unknown, ...args: unknown[]) => {
      console.warn(`[viewer] ${fn}:`, msg, ...args);
    },
    error: (fn: string, msg: unknown, ...args: unknown[]) => {
      console.error(`[viewer] ${fn}:`, msg, ...args);
    },
    debug: (fn: string, msg: unknown, ...args: unknown[]) => {
      console.debug(`[viewer] ${fn}:`, msg, ...args);
    },
  };
}

export const clientLogger = makeLogger();
export const serverLogger = makeLogger();
export const createLogger = () => makeLogger();

export const LinkService = {
  crossAppHref: (_target: string, path: string) => path,
  crossAppHrefClient: (_target: string, path: string) => path,
  getAppOrigin: () =>
    typeof window !== "undefined" ? window.location.origin : "",
};

export function createServerTokenStore() {
  throw new Error("createServerTokenStore is not available in the static viewer");
}

export const PageActions = new Proxy(
  {},
  {
    get: () => noop,
  }
);

export const HAConnectionActions = new Proxy(
  {},
  {
    get: () => async () => null,
  }
);

export const SidebarActions = PageActions;
export const ThemeActions = PageActions;
export const ConfigService = PageActions;

export function countPuckDataWidgets() {
  return 0;
}

export function sanitizeThemeTokens(t: unknown) {
  return t ?? {};
}

export function mergeThemeLayers(...layers: unknown[]) {
  return Object.assign({}, ...layers.filter(Boolean));
}

export function resolvedTokensToCssVars(tokens: Record<string, string>) {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens ?? {})) {
    vars[`--theme-${k}`] = v;
  }
  return vars;
}

export async function resolveDashboardThemeStyles() {
  return { main: {}, sidebar: {} };
}

export function resolveDashboardStyle() {
  return {
    mainId: "homekit",
    main: {},
    sidebarId: "homekit",
    sidebar: {},
  };
}
