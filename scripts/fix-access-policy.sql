-- Drop the restrictive policy
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;

-- Create policy for users to check their own admin status
CREATE POLICY "users_can_read_own_admin_status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create policy for admins to view all admins
CREATE POLICY "admins_can_read_all_admins"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
);

-- Verify policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY policyname;
