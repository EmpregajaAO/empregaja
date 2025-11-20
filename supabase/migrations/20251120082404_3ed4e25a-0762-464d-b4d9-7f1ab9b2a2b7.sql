-- Add admin role for the specified user
-- First, we need to get the user_id from auth.users and insert into user_roles
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user_id for the email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'empregaja.ao@gmail.com';
  
  -- Only proceed if user exists
  IF v_user_id IS NOT NULL THEN
    -- Insert admin role if it doesn't exist
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role added for user: empregaja.ao@gmail.com';
  ELSE
    RAISE NOTICE 'User not found: empregaja.ao@gmail.com';
  END IF;
END $$;