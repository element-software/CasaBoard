-- Hybrid HA: local-first registry in browser; optional cloud metadata in ha_instances.
-- user_settings: user opt-in for storing HA URLs on server (paid + Stripe ha_cloud_sync).

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  ha_cloud_sync boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_settings' AND policyname = 'user_settings_select_own'
  ) THEN
    CREATE POLICY user_settings_select_own ON public.user_settings
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_settings' AND policyname = 'user_settings_insert_own'
  ) THEN
    CREATE POLICY user_settings_insert_own ON public.user_settings
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_settings' AND policyname = 'user_settings_update_own'
  ) THEN
    CREATE POLICY user_settings_update_own ON public.user_settings
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Policies that reference pages.ha_instance_id (or sidebars.ha_instance_id) must be removed
-- before dropping those columns. Supabase/manual policies often use names like this:
DROP POLICY IF EXISTS ha_instances_shared_read ON public.ha_instances;

-- Remove token/credential columns from ha_instances (metadata only when cloud sync is on).
ALTER TABLE public.ha_instances DROP COLUMN IF EXISTS auth;
ALTER TABLE public.ha_instances DROP COLUMN IF EXISTS hass_token;
ALTER TABLE public.ha_instances DROP COLUMN IF EXISTS ha_refresh_token;
ALTER TABLE public.ha_instances DROP COLUMN IF EXISTS expires_at;

ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_ha_instance_id_fkey;
ALTER TABLE public.sidebars DROP CONSTRAINT IF EXISTS sidebars_ha_instance_id_fkey;

-- Backfill Puck data with haInstanceId from legacy FK when present.
UPDATE public.pages p
SET puck_data = jsonb_set(
  COALESCE(p.puck_data::jsonb, '{}'::jsonb),
  '{root,props,haInstanceId}'::text[],
  to_jsonb(p.ha_instance_id::text),
  true
)
WHERE p.ha_instance_id IS NOT NULL
  AND (
    NOT (p.puck_data::jsonb #> '{root,props}' ? 'haInstanceId')
    OR (p.puck_data::jsonb #> '{root,props,haInstanceId}') IS NULL
  );

ALTER TABLE public.pages DROP COLUMN IF EXISTS ha_instance_id;
ALTER TABLE public.sidebars DROP COLUMN IF EXISTS ha_instance_id;
