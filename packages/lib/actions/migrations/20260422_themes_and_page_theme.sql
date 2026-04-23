-- User-defined dashboard themes (CSS token maps)
-- NOTE: pages/sidebars columns must exist BEFORE policies that reference them.

CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tokens JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS themes_user_id_idx ON public.themes(user_id);

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL;

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS theme_overrides JSONB DEFAULT NULL;

ALTER TABLE public.sidebars
  ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pages_theme_id_idx ON public.pages(theme_id);
CREATE INDEX IF NOT EXISTS sidebars_theme_id_idx ON public.sidebars(theme_id);

COMMENT ON COLUMN public.pages.theme_overrides IS 'Optional per-page token overrides (same keys as themes.tokens)';
COMMENT ON COLUMN public.sidebars.theme_id IS 'Optional sidebar-only theme; null inherits page theme when rendered together';

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "themes_select_own" ON public.themes
  FOR SELECT USING (auth.uid() = user_id);

-- Allow anyone to read themes linked to a published dashboard (for shared / anonymous viewers)
CREATE POLICY "themes_select_via_published_page" ON public.themes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.theme_id = themes.id AND p.published = true
    )
    OR EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.sidebars s ON s.id = p.sidebar_id
      WHERE s.theme_id = themes.id AND p.published = true
    )
  );

CREATE POLICY "themes_insert_own" ON public.themes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "themes_update_own" ON public.themes
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "themes_delete_own" ON public.themes
  FOR DELETE USING (auth.uid() = user_id);
