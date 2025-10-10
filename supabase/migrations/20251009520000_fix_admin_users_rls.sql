-- =====================================================
-- FIX ADMIN USERS RLS POLICIES
-- =====================================================
-- This migration fixes the admin_users table to work properly
-- by enabling RLS and creating appropriate policies
-- =====================================================

-- First, ensure the admin_users table has the gamification_role column
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS gamification_role text;

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Service role can do anything with admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow service role full access to admin_users" ON public.admin_users;

-- =====================================================
-- POLICY 1: Service role bypass (for API routes using supabaseAdmin)
-- =====================================================
-- This allows service role to bypass RLS completely
-- The service role is used by API routes for admin operations
CREATE POLICY "Service role can manage all admin users"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLICY 2: Authenticated users can view admin users
-- =====================================================
-- This allows any authenticated user to see who the admins are
-- (needed for displaying admin badges, etc.)
CREATE POLICY "Anyone can view admin users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- POLICY 3: Super admins can manage admin users
-- =====================================================
-- This allows super admins to promote/demote other admins
-- using their own credentials (not service role)
CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (
    -- Check if current user is a super admin
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    -- Check if current user is a super admin
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- =====================================================
-- VERIFY TABLE STRUCTURE
-- =====================================================
-- Ensure the table has all required columns with correct types
DO $$ 
BEGIN
  -- Check if permissions column is array type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'permissions' 
    AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE public.admin_users 
    ALTER COLUMN permissions TYPE text[] USING permissions::text[];
  END IF;

  -- Check if role has proper check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name LIKE '%role%' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE public.admin_users 
    ADD CONSTRAINT admin_users_role_check 
    CHECK (role IN ('admin', 'super_admin', 'moderator'));
  END IF;
END $$;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant authenticated users read access
GRANT SELECT ON public.admin_users TO authenticated;

-- Grant service role full access
GRANT ALL ON public.admin_users TO service_role;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the policies are created:
-- SELECT * FROM pg_policies WHERE tablename = 'admin_users';
