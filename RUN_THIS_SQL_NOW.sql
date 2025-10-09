-- ⚡ COPY THIS ENTIRE FILE AND RUN IN SUPABASE SQL EDITOR ⚡
-- This fixes the infinite recursion error (Code: 42P17)
-- Takes 5 seconds to run

BEGIN;

-- Drop problematic policies
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users";
DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users";

-- Enable RLS
ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

-- Create non-recursive policies
CREATE POLICY "admin_users_read_own"
ON "public"."admin_users"
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "admin_users_read_all"
ON "public"."admin_users"
FOR SELECT TO authenticated
USING (true);

COMMIT;

-- ✅ DONE! Now go back to /admin/diagnostic and click "Auto-Fix (Dev Only)"
