import { Data } from "@measured/puck";

export interface Page {
  id: string;
  name: string;
  slug: string;
  puck_data: Data;
  published: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePageData {
  name: string;
  slug: string;
  puck_data: Data;
  published?: boolean;
}

export interface UpdatePageData {
  name?: string;
  puck_data?: Data;
  published?: boolean;
}
