-- HARD DISABLE RLS ON admin_users AND LOCK WITH GRANTS ONLY
BEGIN;

-- 1) Disable RLS entirely on admin_users
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- 2) Drop any leftover policies safely
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "admin_users_self_read" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "read own admin row" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "admin_users_read_own" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "admin_users_read_all" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "admin_simple_read" ON public.admin_users CASCADE;
DROP POLICY IF EXISTS "allow_read_admin_users" ON public.admin_users CASCADE;

-- 3) Lock table with grants (no policies). Keep it minimal & explicit.
-- Revoke everything first
REVOKE ALL ON public.admin_users FROM PUBLIC;
REVOKE ALL ON public.admin_users FROM anon;
REVOKE ALL ON public.admin_users FROM authenticated;
REVOKE ALL ON public.admin_users FROM service_role;

-- Grant explicit minimums
GRANT SELECT ON public.admin_users TO authenticated; -- read is allowed for authenticated apps
GRANT ALL PRIVILEGES ON public.admin_users TO service_role; -- backend can manage

COMMIT;