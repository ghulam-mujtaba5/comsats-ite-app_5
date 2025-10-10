-- Grant super_admin to a user if one exists
-- Safe to run multiple times: conditional insert
BEGIN;

-- Only try to insert if the user exists in auth.users
INSERT INTO public.admin_users (user_id, role)
SELECT u.id, 'super_admin'
FROM auth.users u
WHERE u.id = '33b2f6fd-4f34-4f37-b539-acecea146126'::uuid
AND NOT EXISTS (
  SELECT 1 FROM public.admin_users WHERE user_id = '33b2f6fd-4f34-4f37-b539-acecea146126'::uuid
);

COMMIT;