-- Migration: Replace hass_token and ha_refresh_token with auth JSON column in ha_instances
-- Date: 2025-09-26

-- Remove old token columns
ALTER TABLE ha_instances DROP COLUMN IF EXISTS hass_token;
ALTER TABLE ha_instances DROP COLUMN IF EXISTS ha_refresh_token;

-- Add new auth column
ALTER TABLE ha_instances ADD COLUMN auth JSONB;

-- Optionally, you may want to migrate existing token data to the new column if needed
-- Example (if you want to preserve old tokens):
-- UPDATE ha_instances SET auth = jsonb_build_object('access_token', hass_token, 'refresh_token', ha_refresh_token) WHERE hass_token IS NOT NULL OR ha_refresh_token IS NOT NULL;

-- Done
