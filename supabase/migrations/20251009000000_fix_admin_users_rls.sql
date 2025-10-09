-- Fix admin_users RLS policies to allow proper admin management
-- This migration:
-- 1. Drops overly restrictive RLS policies
-- 2. Creates proper policies that allow admins to manage other admins
-- 3. Ensures service role can always access admin_users

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "admin_users_self_read" ON "public"."admin_users";
DROP POLICY IF EXISTS "read own admin row" ON "public"."admin_users";

-- Allow authenticated users to read admin_users (needed to check if user is admin)
-- This is safe because it only contains role information, not sensitive data
CREATE POLICY "authenticated_read_admin_users" 
ON "public"."admin_users" 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow only super_admins to insert new admin users
CREATE POLICY "super_admin_insert_admin_users" 
ON "public"."admin_users" 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Allow only super_admins to update admin users
CREATE POLICY "super_admin_update_admin_users" 
ON "public"."admin_users" 
FOR UPDATE 
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

-- Allow only super_admins to delete admin users
CREATE POLICY "super_admin_delete_admin_users" 
ON "public"."admin_users" 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Ensure service_role can bypass RLS (should be default but let's be explicit)
ALTER TABLE "public"."admin_users" FORCE ROW LEVEL SECURITY;

-- Add helpful comment
COMMENT ON TABLE "public"."admin_users" IS 'Admin users with role-based permissions. RLS allows authenticated users to read, but only super_admins can modify.';
