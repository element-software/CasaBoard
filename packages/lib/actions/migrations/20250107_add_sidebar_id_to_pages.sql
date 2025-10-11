-- Add sidebar_id field to pages table
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS sidebar_id uuid REFERENCES public.sidebars(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS pages_sidebar_id_idx ON public.pages(sidebar_id);

-- Add comment for documentation
COMMENT ON COLUMN public.pages.sidebar_id IS 'Optional sidebar associated with this page';
