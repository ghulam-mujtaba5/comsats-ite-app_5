-- Emergency fix for admin access issues
-- Run this directly in Supabase SQL Editor if you're locked out

-- Step 1: Check current admin_users
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

-- Step 2: If you see your user but can't access admin panel, verify RLS policies
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

-- Step 3: Temporarily disable RLS (ONLY FOR DEBUGGING - RE-ENABLE AFTER!)
-- UNCOMMENT ONLY IF DESPERATE:
-- ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Step 4: Add yourself as super_admin (replace with your actual email)
-- IMPORTANT: Replace 'YOUR_EMAIL@cuilahore.edu.pk' with your actual email
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

-- Step 5: Verify the insert worked
SELECT 
  au.id,
  au.user_id,
  au.role,
  au.permissions,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'YOUR_EMAIL@cuilahore.edu.pk';

-- Step 6: Re-enable RLS with proper policies
-- (This is done by the migration file)
