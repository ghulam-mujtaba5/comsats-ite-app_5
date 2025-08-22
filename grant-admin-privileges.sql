-- Grant admin privileges to existing user
INSERT INTO admin_users (user_id, role, permissions)
VALUES (
    '33b2f6fd-4f34-4f37-b539-acecea146126',
    'super_admin',
    ARRAY['all']
)
ON CONFLICT (user_id) DO UPDATE SET
    role = 'super_admin',
    permissions = ARRAY['all'];
