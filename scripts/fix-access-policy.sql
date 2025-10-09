-- =====================================================
-- FIX: Allow authenticated users to check their own admin status
-- =====================================================

-- First, drop the existing policy
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;

-- Create two simpler policies:

-- 1. Users can check their own admin status
CREATE POLICY "users_read_own_admin"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. Admins can view all admin users (for admin panel)
CREATE POLICY "admins_read_all"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Admin access policies updated - users can now check their status';
END $$;
