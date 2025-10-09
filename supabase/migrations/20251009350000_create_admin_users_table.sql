-- Create admin_users table for community management
-- This table will store information about admin users and their permissions

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'moderator', -- admin, super_admin, moderator
    permissions TEXT[] DEFAULT '{}', -- Array of specific permissions
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure each user can only have one admin record
    UNIQUE(user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_admin_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS admin_users_updated_at ON admin_users;
CREATE TRIGGER admin_users_updated_at 
BEFORE UPDATE ON admin_users 
FOR EACH ROW EXECUTE FUNCTION update_admin_users_timestamp();

-- RLS Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can view other admins
CREATE POLICY "Admins can view admin users" ON admin_users 
FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users au 
        WHERE au.user_id = auth.uid() 
        AND au.role IN ('admin', 'super_admin')
    )
);

-- Super admins can manage admin users
CREATE POLICY "Super admins can manage admin users" ON admin_users 
FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM admin_users au 
        WHERE au.user_id = auth.uid() 
        AND au.role = 'super_admin'
    )
);

-- Users can view their own admin record
CREATE POLICY "Users can view own admin record" ON admin_users 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

COMMENT ON TABLE admin_users IS 'Admin users and their permissions for community management';
COMMENT ON COLUMN admin_users.role IS 'User role: admin, super_admin, or moderator';
COMMENT ON COLUMN admin_users.permissions IS 'Specific permissions granted to the user';