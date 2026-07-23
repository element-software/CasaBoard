import { Data } from "@measured/puck";

export interface Sidebar {
  id: string;
  name: string;
  slug: string;
  puck_data: Data;
  theme_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSidebarData {
  name: string;
  slug: string;
  puck_data: Data;
  theme_id?: string | null;
}

export interface UpdateSidebarData {
  name?: string;
  puck_data?: Data;
  theme_id?: string | null;
}
