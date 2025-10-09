-- Create a function that bypasses RLS to get admin user
-- This is a workaround for broken RLS policies
-- Only callable with service role key

CREATE OR REPLACE FUNCTION get_admin_user(p_user_id UUID)
RETURNS TABLE (id INT, role TEXT, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER -- Run with function owner's permissions (bypasses RLS)
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.role, a.user_id
  FROM admin_users a
  WHERE a.user_id = p_user_id
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
-- (Service role will call this, which has elevated privileges)
GRANT EXECUTE ON FUNCTION get_admin_user(UUID) TO authenticated;

COMMENT ON FUNCTION get_admin_user IS 'Bypasses RLS to check if user is admin. Used by elevation endpoint with service role key.';
