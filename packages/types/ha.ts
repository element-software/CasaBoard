export interface HAInstance {
  id: string;
  name: string;
  hass_url: string;
  hass_token: string;
  created_at: string;
  /** Present when merged from local registry / cloud metadata. */
  source?: "local" | "cloud";
}