-- Add user_id column to perfis table that was missing
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_perfis_user_id ON public.perfis(user_id);

-- Update existing perfis records to link user_id with id (they should match)
UPDATE public.perfis SET user_id = id WHERE user_id IS NULL;