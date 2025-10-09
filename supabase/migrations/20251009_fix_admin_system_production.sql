-- =====================================================
-- PRODUCTION FIX: Admin System Complete Solution (2025-10-09)
-- =====================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_full_access" ON public.admin_users;
DROP POLICY IF EXISTS "authenticated_read_admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "super_admin_manage_all" ON public.admin_users;

CREATE POLICY "service_role_full_access"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "authenticated_read_admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "super_admin_manage_all"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
);

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'gamification_role'
  ) THEN
    ALTER TABLE public.admin_users 
    ADD COLUMN gamification_role TEXT;
  END IF;
END $$;

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'fa22-bse-199@cuilahore.edu.pk'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, role, permissions, gamification_role)
    VALUES (v_user_id, 'super_admin', ARRAY['all'], 'moderator')
    ON CONFLICT (user_id)
    DO UPDATE SET
      role = 'super_admin',
      permissions = ARRAY['all'],
      gamification_role = COALESCE(admin_users.gamification_role, 'moderator'),
      updated_at = NOW();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON public.admin_users(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
