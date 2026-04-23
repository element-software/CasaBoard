import { Data } from "@measured/puck";
import type { ThemeTokens } from "./theme";
import { Sidebar } from "@repo/types/sidebar";

export interface Page {
  id: string;
  name: string;
  slug: string;
  puck_data: Data;
  published: boolean;
  user_id: string;
  sidebar_id?: string | null;
  sidebar?: Sidebar;
  theme_id?: string | null;
  theme_overrides?: ThemeTokens | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePageData {
  name: string;
  slug: string;
  puck_data: Data;
  published?: boolean;
  sidebar_id?: string | null;
  theme_id?: string | null;
  theme_overrides?: ThemeTokens | null;
}

export interface UpdatePageData {
  name?: string;
  puck_data?: Data;
  published?: boolean;
  sidebar_id?: string | null;
  theme_id?: string | null;
  theme_overrides?: ThemeTokens | null;
}
