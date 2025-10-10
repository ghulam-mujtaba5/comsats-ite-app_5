-- =====================================================
-- VERIFY AND FIX ADMIN USER (fa22-bse-199)
-- =====================================================
-- Run this in Supabase SQL Editor to check and fix your admin setup
-- =====================================================

-- 1. Find your user in auth.users
SELECT 
  id as user_id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'fa22-bse-199@cuilahore.edu.pk';

-- Expected: 1 row with your user details
-- Copy the 'user_id' for next steps

-- =====================================================
-- 2. Check if admin record exists
-- =====================================================
SELECT 
  au.id as admin_id,
  au.user_id,
  au.role,
  au.permissions,
  au.gamification_role,
  au.created_at,
  u.email
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'fa22-bse-199@cuilahore.edu.pk';

-- Expected: 1 row with role = 'super_admin'
-- If NO rows returned, run step 3 below

-- =====================================================
-- 3. CREATE ADMIN RECORD (if missing)
-- =====================================================
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with the user_id from step 1

-- Example:
-- INSERT INTO admin_users (user_id, role, permissions)
-- VALUES (
--   'abc12345-6789-...',  -- Replace with actual user_id from step 1
--   'super_admin',
--   ARRAY['all']
-- )
-- ON CONFLICT (user_id) DO UPDATE
-- SET role = 'super_admin', permissions = ARRAY['all'];

-- =====================================================
-- 4. VERIFY ALL ADMIN USERS
-- =====================================================
SELECT 
  au.id,
  u.email,
  au.role,
  au.permissions,
  au.gamification_role,
  au.created_at
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- Expected: Should see fa22-bse-199@cuilahore.edu.pk with super_admin role

-- =====================================================
-- 5. CHECK RLS POLICIES (for debugging)
-- =====================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'admin_users';

-- Expected: Should see 3 policies:
-- 1. Service role can manage all admin users
-- 2. Anyone can view admin users
-- 3. Super admins can manage admin users

-- =====================================================
-- 6. OPTIONAL: Remove duplicate/test admin (if needed)
-- =====================================================
-- If you want to remove the test admin@cuilahore.edu.pk account:

-- First, find it:
-- SELECT id, user_id FROM admin_users au
-- JOIN auth.users u ON u.id = au.user_id
-- WHERE u.email = 'admin@cuilahore.edu.pk';

-- Then delete from admin_users:
-- DELETE FROM admin_users 
-- WHERE user_id IN (
--   SELECT id FROM auth.users WHERE email = 'admin@cuilahore.edu.pk'
-- );

-- Optionally delete from auth.users too:
-- DELETE FROM auth.users WHERE email = 'admin@cuilahore.edu.pk';

-- =====================================================
-- TROUBLESHOOTING QUERIES
-- =====================================================

-- See all users (to find correct email/ID)
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 20;

-- Count admin users
-- SELECT COUNT(*) as admin_count FROM admin_users;

-- Check specific user's admin status by email
-- SELECT EXISTS (
--   SELECT 1 FROM admin_users au
--   JOIN auth.users u ON u.id = au.user_id
--   WHERE u.email = 'fa22-bse-199@cuilahore.edu.pk'
-- ) as is_admin;
