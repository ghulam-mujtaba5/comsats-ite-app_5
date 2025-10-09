-- Add fa22-bse-199@cuilahore.edu.pk as super_admin
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

-- Verify
SELECT 
  au.role,
  au.permissions,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'fa22-bse-199@cuilahore.edu.pk';
