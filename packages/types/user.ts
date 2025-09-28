export interface UserSettings {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
}

export type Profile = {
  email: string | null;
  id: string | null;
  verified: boolean;
  lastSignIn: string | null;
};
