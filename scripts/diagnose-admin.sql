-- Quick diagnostic queries for admin access issues
-- Run these in Supabase SQL Editor to debug

-- ============================================
-- QUERY 1: Check all admin users
-- ============================================
SELECT 
  au.id,
  au.user_id,
  au.role,
  au.permissions,
  au.gamification_role,
  au.created_at,
  u.email,
  u.created_at as user_created_at,
  u.last_sign_in_at
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- Expected: Should see list of all admin users
-- If empty: No admins exist - need to create one
-- If only see 1 row: RLS is blocking, you can only see yourself


-- ============================================
-- QUERY 2: Check RLS policies on admin_users
-- ============================================
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
WHERE tablename = 'admin_users'
ORDER BY policyname;

-- Expected: Should see policies like:
-- - authenticated_read_admin_users (SELECT)
-- - super_admin_manage_admin_users (ALL)
-- If different: Need to run fix migration


-- ============================================
-- QUERY 3: Check if RLS is enabled
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'admin_users';

-- Expected: rowsecurity = true
-- If false: RLS is disabled (security risk!)


-- ============================================
-- QUERY 4: Find your user ID
-- ============================================
-- Replace with your email:
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'YOUR_EMAIL@cuilahore.edu.pk'  -- ⚠️ CHANGE THIS
LIMIT 1;

-- Copy the 'id' value for next query


-- ============================================
-- QUERY 5: Check if you're an admin
-- ============================================
-- Replace with your user ID from Query 4:
SELECT 
  au.*,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.user_id = 'PASTE_YOUR_USER_ID_HERE';  -- ⚠️ CHANGE THIS

-- Expected: Should show your admin row
-- If empty: You're not in admin_users table - need to add yourself


-- ============================================
-- QUERY 6: Test if service role can read
-- ============================================
-- This should work even with RLS enabled
SET ROLE postgres;
SELECT COUNT(*) as admin_count FROM admin_users;
RESET ROLE;

-- Expected: Number greater than 0
-- If 0: No admins exist at all


-- ============================================
-- QUERY 7: Check table structure
-- ============================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

-- Expected columns:
-- - id (uuid)
-- - user_id (uuid)
-- - role (character varying)
-- - permissions (ARRAY)
-- - gamification_role (text)
-- - created_at (timestamp)


-- ============================================
-- QUERY 8: Check for orphaned admin records
-- ============================================
-- Admin records where user doesn't exist
SELECT 
  au.*
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
WHERE u.id IS NULL;

-- Expected: Empty result
-- If rows found: Clean them up with DELETE


-- ============================================
-- DIAGNOSTIC SUMMARY
-- ============================================
-- Run this to get full diagnostic info:
SELECT 
  'Total Admins' as metric,
  COUNT(*)::text as value
FROM admin_users
UNION ALL
SELECT 
  'Super Admins',
  COUNT(*)::text
FROM admin_users
WHERE role = 'super_admin'
UNION ALL
SELECT 
  'Regular Admins',
  COUNT(*)::text
FROM admin_users
WHERE role = 'admin'
UNION ALL
SELECT 
  'RLS Enabled',
  CASE WHEN rowsecurity THEN 'Yes' ELSE 'No' END
FROM pg_tables
WHERE tablename = 'admin_users'
UNION ALL
SELECT 
  'RLS Policies',
  COUNT(*)::text
FROM pg_policies
WHERE tablename = 'admin_users';

-- This gives you a quick overview of admin table status


-- ============================================
-- COMMON FIXES
-- ============================================

-- FIX 1: Add yourself as super_admin
/*
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  ARRAY['all']
FROM auth.users
WHERE email = 'YOUR_EMAIL@cuilahore.edu.pk'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin',
  permissions = ARRAY['all'];
*/

-- FIX 2: Promote existing admin to super_admin
/*
UPDATE admin_users 
SET 
  role = 'super_admin',
  permissions = ARRAY['all']
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR_EMAIL@cuilahore.edu.pk'
);
*/

-- FIX 3: Remove duplicate admin records
/*
DELETE FROM admin_users
WHERE id NOT IN (
  SELECT MIN(id)
  FROM admin_users
  GROUP BY user_id
);
*/

-- FIX 4: Clean orphaned admin records
/*
DELETE FROM admin_users
WHERE user_id NOT IN (
  SELECT id FROM auth.users
);
*/
