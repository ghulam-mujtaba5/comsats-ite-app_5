-- Automated Admin Access Fix for fa22-bse-199@cuilahore.edu.pk
-- Generated: October 9, 2025

-- Step 1: Drop old restrictive RLS policies
DROP POLICY IF EXISTS "admin_users_self_read" ON public.admin_users;
DROP POLICY IF EXISTS "read own admin row" ON public.admin_users;

-- Step 2: Create policy - Allow reading admin_users
CREATE POLICY "authenticated_read_admin_users" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

-- Step 3: Create policy - Allow super_admins to manage
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

-- Step 4: Add fa22-bse-199@cuilahore.edu.pk as super_admin
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  id,
  'super_admin',
  ARRAY['all']
FROM auth.users
WHERE email = 'fa22-bse-199@cuilahore.edu.pk'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'super_admin',
  permissions = ARRAY['all'];

-- Step 5: Verify
SELECT 
  au.role,
  au.permissions,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'fa22-bse-199@cuilahore.edu.pk';
