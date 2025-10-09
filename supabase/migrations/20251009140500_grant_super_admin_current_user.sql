-- Grant super_admin to the known current user id
-- Safe to run multiple times: conditional insert
BEGIN;

INSERT INTO public.admin_users (user_id, role)
SELECT '33b2f6fd-4f34-4f37-b539-acecea146126'::uuid, 'super_admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_users WHERE user_id = '33b2f6fd-4f34-4f37-b539-acecea146126'::uuid
);

COMMIT;
