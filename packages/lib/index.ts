export * as PageActions from "./actions/pageActions";
export * as SidebarActions from "./actions/sidebarActions";
export * as SupabaseServer from "./supabase/server";
export * as SupabaseMiddleware from "./supabase/middleware";
export * as SupabaseClient from "./supabase/client";
export * as ConfigService from "./services/configService";
export * as HAInstanceActions from "./actions/haInstanceActions";
export * as Encryption from "./encryption";
export { generateSessionId } from "./encryption";
export * as LinkService from "./services/linkService";
export { getCurrentAuthUser } from "./supabase/server";
export { createLogger, serverLogger, clientLogger } from "./logger";
export * as Clarity from "./clarity";
export {
  initClarity,
  identifyClarityUser,
  trackClarityEvent,
  setClarityUser,
  generateClaritySessionId,
  getSessionId,
} from "./clarity";

// Local-first storage layer (client-side, localStorage)
export * as HAInstanceStorage from "./storage/haInstanceStorage";
export * as PageStorage from "./storage/pageStorage";
export * as SidebarStorage from "./storage/sidebarStorage";
export * as DataPortability from "./storage/dataPortability";
export * from "./storage/storageKeys";
export type { StoredHAInstance } from "./storage/haInstanceStorage";
export type { StoredSidebar } from "./storage/sidebarStorage";
