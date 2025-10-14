-- Add ha_instance_id column to sidebars table
ALTER TABLE public.sidebars
ADD COLUMN ha_instance_id uuid REFERENCES public.ha_instances(id) ON DELETE CASCADE;

-- Create an index on ha_instance_id for faster lookups
CREATE INDEX sidebars_ha_instance_id_idx ON public.sidebars(ha_instance_id);

-- Update existing sidebars to use the first HA instance for the user
-- This is a one-time migration for existing data
UPDATE public.sidebars 
SET ha_instance_id = (
  SELECT hi.id 
  FROM public.ha_instances hi 
  WHERE hi.user_id = sidebars.user_id 
  ORDER BY hi.created_at ASC 
  LIMIT 1
)
WHERE ha_instance_id IS NULL;
