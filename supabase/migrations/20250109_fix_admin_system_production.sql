-- =====================================================
-- PRODUCTION FIX: Admin System Complete Solution (idempotent)
-- =====================================================
-- This migration fixes:
-- 1. RLS policies on admin_users table
-- 2. Ensures fa22-bse-199@cuilahore.edu.pk is super admin
-- 3. Fixes promote user functionality
-- 4. Adds proper indexes and constraints
-- =====================================================

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (clean slate, robust)
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_users'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_users', r.policyname);
  END LOOP;
END $$;

-- Step 3: Create proper RLS policies

-- Policy 1: Service role has full access (for API endpoints)
CREATE POLICY "service_role_full_access"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Authenticated users can view admin users (for admin panel display)
CREATE POLICY "authenticated_read_admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Super admins can manage all admin users (promote/demote)
CREATE POLICY "super_admin_manage_all"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
);

-- Step 4: Add gamification_role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'gamification_role'
  ) THEN
    ALTER TABLE public.admin_users 
    ADD COLUMN gamification_role TEXT;
  END IF;
  
  -- Ensure created_at column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users'
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.admin_users
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
  
  -- Ensure updated_at column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.admin_users
    ADD COLUMN updated_at TIMESTAMPTZ;
  END IF;
END $$;

-- Step 5: Ensure fa22-bse-199@cuilahore.edu.pk is super admin
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'fa22-bse-199@cuilahore.edu.pk'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Upsert admin record
    INSERT INTO public.admin_users (user_id, role, permissions, gamification_role)
    VALUES (v_user_id, 'super_admin', ARRAY['all'], 'moderator')
    ON CONFLICT (user_id)
    DO UPDATE SET
      role = 'super_admin',
      permissions = ARRAY['all'],
      gamification_role = COALESCE(admin_users.gamification_role, 'moderator'),
      updated_at = NOW();

    RAISE NOTICE 'Super admin configured: fa22-bse-199@cuilahore.edu.pk (user_id: %)', v_user_id;
  ELSE
    RAISE WARNING 'User not found: fa22-bse-199@cuilahore.edu.pk - Please create this user in Supabase Dashboard first';
  END IF;
END $$;

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON public.admin_users(created_at DESC);

-- Step 7: Add updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Verify the setup
DO $$
DECLARE
  v_admin_count INTEGER;
  v_super_admin_email TEXT;
BEGIN
  -- Count total admins
  SELECT COUNT(*) INTO v_admin_count
  FROM public.admin_users;

  -- Get super admin email
  SELECT u.email INTO v_super_admin_email
  FROM public.admin_users a
  JOIN auth.users u ON a.user_id = u.id
  WHERE a.role = 'super_admin'
  LIMIT 1;

  RAISE NOTICE '====================================';
  RAISE NOTICE 'ADMIN SYSTEM SETUP COMPLETE';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Total admin users: %', v_admin_count;
  RAISE NOTICE 'Super admin: %', COALESCE(v_super_admin_email, 'None configured');
  RAISE NOTICE 'RLS Policies: 3 policies created';
  RAISE NOTICE 'Indexes: Created';
  RAISE NOTICE 'Triggers: Updated';
  RAISE NOTICE '====================================';
END $$;

-- Step 9: Grant necessary permissions
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;

-- Success message
COMMENT ON TABLE public.admin_users IS 'Admin users table - Last updated: 2025-01-09 - Production ready with proper RLS policies';
