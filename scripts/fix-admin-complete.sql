-- ============================================================================
-- ADMIN ACCESS FIX - Complete SQL Solution
-- Run this in Supabase SQL Editor Dashboard
-- ============================================================================

-- STEP 1: Check current admin_users (diagnostic)
-- This shows all existing admin users
SELECT
  au.id,
  au.user_id,
  au.role,
  au.permissions,
  au.created_at,
  u.email
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- STEP 2: Check current RLS policies (diagnostic)
-- This shows what's blocking admin management
SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'admin_users';

-- STEP 3: Drop old restrictive policies
-- These policies only allow users to see their own row
DROP POLICY IF EXISTS "admin_users_self_read" ON public.admin_users;
DROP POLICY IF EXISTS "read own admin row" ON public.admin_users;

-- STEP 4: Create new policy - Allow reading admin_users
-- This is safe because admin_users only contains role information
-- Everyone needs to read this table to check if they're an admin
CREATE POLICY "authenticated_read_admin_users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

-- STEP 5: Create new policy - Allow super_admins to manage admins
-- Only super_admins can INSERT, UPDATE, DELETE admin_users
CREATE POLICY "super_admin_manage_admin_users" 
ON public.admin_users 
FOR ALL
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- STEP 6: Add yourself as super_admin
-- ⚠️ CRITICAL: Replace YOUR_EMAIL@cuilahore.edu.pk with YOUR actual email
-- This appears in 2 places below - change BOTH!
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  ARRAY['all']
FROM auth.users
WHERE email = 'YOUR_EMAIL@cuilahore.edu.pk'  -- ⚠️ CHANGE THIS LINE!
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin',
  permissions = ARRAY['all'];

-- STEP 7: Verify it worked
-- Should show your email with role = 'super_admin'
SELECT 
  au.role,
  au.permissions,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'YOUR_EMAIL@cuilahore.edu.pk';  -- ⚠️ CHANGE THIS LINE!

-- STEP 8: List all admin users (final check)
-- Should show all admins (not just yourself)
SELECT 
  u.email,
  au.role,
  au.permissions,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- ============================================================================
-- DONE! Now test in your app:
-- 1. Refresh the admin page (Ctrl + Shift + R)
-- 2. Try promoting a user
-- 3. Should work without "Failed to promote" error ✅
-- ============================================================================
