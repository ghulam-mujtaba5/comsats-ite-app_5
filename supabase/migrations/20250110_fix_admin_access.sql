-- =====================================================
-- FIX: Allow authenticated users to check their own admin status
-- =====================================================
-- This migration adds a policy that allows authenticated users
-- to check if THEIR OWN user_id is in the admin_users table
-- =====================================================

-- Drop the restrictive authenticated_read policy
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;

-- Create a new policy that allows authenticated users to read their own admin record
CREATE POLICY "users_can_check_own_admin_status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Also allow authenticated users to view all admins (for admin panel)
CREATE POLICY "authenticated_users_can_view_admins"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  -- Either you're checking your own status
  user_id = auth.uid()
  -- OR you're already an admin viewing the admin list
  OR EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Admin access policies updated';
  RAISE NOTICE 'Authenticated users can now check their admin status';
END $$;
