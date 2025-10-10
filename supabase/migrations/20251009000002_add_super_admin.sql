-- Add a default super_admin user if one doesn't exist
-- This will only run in development environments
DO $$
BEGIN
  -- Only run this in local development
  IF current_database() = 'postgres' THEN
    -- Check if any super_admin exists, if not create a placeholder
    IF NOT EXISTS (
      SELECT 1 FROM public.admin_users WHERE role = 'super_admin'
    ) THEN
      -- Create a placeholder super admin (in production, this would be done manually)
      RAISE NOTICE 'No super admin found. In production, you would manually promote a user.';
    END IF;
  END IF;
END $$;

-- For local development, we'll add a comment instead of a specific user
-- In production, you would manually run:
-- INSERT INTO public.admin_users (user_id, role, permissions)
-- SELECT id, 'super_admin', ARRAY['all'] FROM auth.users WHERE email = 'fa22-bse-199@cuilahore.edu.pk';