-- Apply Super Admin Role Changes
-- Run this SQL in your Supabase SQL Editor

-- Ensure the admin_users table has the proper structure
-- Add constraint for role values if it doesn't exist
DO $$ 
BEGIN
  -- Check if role column has proper check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'admin_users_role_check'
    AND constraint_schema = 'public'
  ) THEN
    -- Add constraint for role values
    ALTER TABLE public.admin_users 
    ADD CONSTRAINT admin_users_role_check 
    CHECK (role IN ('admin', 'super_admin', 'moderator'));
  ELSE
    -- Update existing constraint to include super_admin
    ALTER TABLE public.admin_users 
    DROP CONSTRAINT admin_users_role_check;
    
    ALTER TABLE public.admin_users 
    ADD CONSTRAINT admin_users_role_check 
    CHECK (role IN ('admin', 'super_admin', 'moderator'));
  END IF;
END $$;

-- Ensure gamification_role column exists with proper constraints
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS gamification_role TEXT;

-- Add check constraint for valid gamification roles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'valid_gamification_role'
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE public.admin_users
    ADD CONSTRAINT valid_gamification_role 
    CHECK (
      gamification_role IS NULL OR 
      gamification_role IN (
        'content-curator',
        'community-moderator', 
        'tech-support',
        'campus-ambassador'
      )
    );
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_gamification_role 
ON admin_users(gamification_role) 
WHERE gamification_role IS NOT NULL;

-- Ensure the existing super admin user has the proper role and gamification role
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID for the known super admin
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'fa22-bse-199@cuilahore.edu.pk'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Ensure this user has super_admin role with proper permissions
    INSERT INTO public.admin_users (user_id, role, permissions, gamification_role)
    VALUES (v_user_id, 'super_admin', ARRAY['all'], 'community-moderator')
    ON CONFLICT (user_id)
    DO UPDATE SET
      role = 'super_admin',
      permissions = ARRAY['all'],
      gamification_role = COALESCE(admin_users.gamification_role, 'community-moderator'),
      updated_at = NOW();
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN admin_users.gamification_role IS 
'Admin-assigned gamification team role (content-curator, community-moderator, tech-support, campus-ambassador). Displays on profile and leaderboard.';
COMMENT ON COLUMN admin_users.role IS 
'Admin role level (admin, super_admin, moderator). Controls access permissions.';

-- Verification query
-- This should show the super admin user with proper roles
SELECT 
  au.role,
  au.permissions,
  au.gamification_role,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'fa22-bse-199@cuilahore.edu.pk';