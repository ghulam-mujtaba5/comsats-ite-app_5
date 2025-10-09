-- Fix infinite recursion in admin_users RLS policies (Error Code: 42P17)
-- 
-- PROBLEM: Policies were checking admin_users table while trying to access admin_users
-- This creates circular dependency: "I need to check admin_users to see if I can access admin_users"
-- 
-- SOLUTION: Use simpler policies that don't cause recursion
-- Service role key bypasses RLS anyway for admin elevation endpoint

BEGIN;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_insert_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_update_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "super_admin_delete_admin_users" ON "public"."admin_users";
DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users";
DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users";

-- Enable RLS (required for service role to bypass)
ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to READ their own admin record
-- This allows users to check if they're admin without recursion
CREATE POLICY "admin_users_read_own"
ON "public"."admin_users"
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Allow authenticated users to READ all admin records
-- This is needed for admin dashboards to show other admins
-- Safe because admin_users only contains role info, not sensitive data
CREATE POLICY "admin_users_read_all"
ON "public"."admin_users"
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Disable INSERT/UPDATE/DELETE from client
-- Admin changes should only happen via service role (auto-fix endpoint)
-- This prevents the recursion issue entirely
-- (Service role key bypasses RLS anyway)

-- Add comment explaining the setup
COMMENT ON TABLE "public"."admin_users" IS 
'Admin users table with RLS. 
Read: Authenticated users can read all records.
Write: Only via service role key (bypasses RLS) through /api/admin/auto-fix endpoint.
This prevents infinite recursion while maintaining security.';

COMMIT;
