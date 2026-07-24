import type { Data } from "@measured/puck";
import type { StyleId } from "./style";

/**
 * Baked payload written to PUBLISH_DIR/pages/{slug}.json for the static viewer.
 * No auth tokens — hassUrl only; the viewer stores tokens in localStorage.
 */
export interface PublishedPagePayload {
  version: 1;
  slug: string;
  name: string;
  hassUrl: string;
  puck_data: Data;
  sidebar: {
    puck_data: Data;
  } | null;
  themeMain: Record<string, string>;
  themeSidebar: Record<string, string>;
  styleMainId: StyleId;
  styleMainVars: Record<string, string>;
  styleSidebarId: StyleId;
  styleSidebarVars: Record<string, string>;
}
