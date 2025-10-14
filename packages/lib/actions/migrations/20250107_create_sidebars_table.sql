-- Create sidebars table
CREATE TABLE IF NOT EXISTS sidebars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  puck_data JSONB NOT NULL DEFAULT '{}',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sidebars_user_id ON sidebars(user_id);
CREATE INDEX IF NOT EXISTS idx_sidebars_slug ON sidebars(slug);

-- Enable RLS
ALTER TABLE sidebars ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sidebars" ON sidebars
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sidebars" ON sidebars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sidebars" ON sidebars
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sidebars" ON sidebars
  FOR DELETE USING (auth.uid() = user_id);
