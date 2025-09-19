import { Data } from "@measured/puck";

export interface Page {
  id: string;
  name: string;
  slug: string;
  puck_data: Data;
  published: boolean;
  user_id: string;
  ha_instance_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePageData {
  name: string;
  slug: string;
  puck_data: Data;
  published?: boolean;
  ha_instance_id?: string | null;
}

export interface UpdatePageData {
  name?: string;
  puck_data?: Data;
  published?: boolean;
  ha_instance_id?: string | null;
}
