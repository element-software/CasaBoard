import { Data } from "@measured/puck";
import { HAInstance as HAInstanceType } from "@repo/types/ha";

export interface Sidebar {
  id: string;
  name: string;
  slug: string;
  puck_data: Data;
  user_id: string;
  ha_instance_id?: string | null;
  ha_instance?: HAInstanceType;
  created_at: string;
  updated_at: string;
}

export interface CreateSidebarData {
  name: string;
  slug: string;
  puck_data: Data;
  ha_instance_id?: string | null;
}

export interface UpdateSidebarData {
  name?: string;
  puck_data?: Data;
  ha_instance_id?: string | null;
}
