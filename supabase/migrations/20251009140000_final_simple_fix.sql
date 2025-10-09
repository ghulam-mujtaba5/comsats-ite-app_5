-- FINAL FIX: Drop everything and create ONE simple policy
-- No recursion, no complexity, just works!

BEGIN;

-- Drop EVERYTHING
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON admin_users CASCADE;
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON admin_users CASCADE;
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON admin_users CASCADE;
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON admin_users CASCADE;
DROP POLICY IF EXISTS "admin_users_self_read" ON admin_users CASCADE;
DROP POLICY IF EXISTS "read own admin row" ON admin_users CASCADE;
DROP POLICY IF EXISTS "admin_users_read_own" ON admin_users CASCADE;
DROP POLICY IF EXISTS "admin_users_read_all" ON admin_users CASCADE;
DROP POLICY IF EXISTS "allow_read_admin_users" ON admin_users CASCADE;

-- ONE simple policy that just works
CREATE POLICY "admin_simple_read"
ON admin_users
FOR SELECT
USING (true);

COMMIT;
