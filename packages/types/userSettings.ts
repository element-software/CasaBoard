export interface UserSettings {
  id: string;
  user_id: string;
  hass_url?: string;
  hass_token?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserSettingsData {
  hass_url?: string;
  hass_token?: string;
}

export interface UpdateUserSettingsData {
  hass_url?: string;
  hass_token?: string;
}
