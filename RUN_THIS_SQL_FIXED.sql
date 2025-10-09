-- ⚡ FIX: Handle existing policies - Run this instead ⚡
-- This version drops AND recreates policies to ensure they're correct
-- PLUS adds a bypass function for the service role key

BEGIN;

-- Drop ALL existing policies (including the new ones)
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users";
DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_read_own" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_read_all" ON "public"."admin_users";

-- Enable RLS
ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

-- Create fresh non-recursive policies
CREATE POLICY "admin_users_read_own"
ON "public"."admin_users"
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "admin_users_read_all"
ON "public"."admin_users"
FOR SELECT TO authenticated
USING (true);

-- Create bypass function for service role key (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION get_admin_user(p_user_id UUID)
RETURNS TABLE (id INT, role TEXT, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.role, a.user_id
  FROM admin_users a
  WHERE a.user_id = p_user_id
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION get_admin_user(UUID) TO authenticated;

COMMIT;

-- ✅ DONE! Now refresh /admin/diagnostic and click "Auto-Fix (Dev Only)"
