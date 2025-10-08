-- Add gamification_role column to admin_users table
-- This allows admins to assign special roles (Content Curator, Community Moderator, etc.)
-- that display in leaderboard and profile alongside earned gamification levels

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS gamification_role TEXT;

-- Add check constraint for valid gamification roles
ALTER TABLE admin_users
ADD CONSTRAINT valid_gamification_role 
CHECK (
  gamification_role IS NULL OR 
  gamification_role IN (
    'content-curator',
    'community-moderator', 
    'tech-support',
    'campus-ambassador'
  )
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_users_gamification_role 
ON admin_users(gamification_role) 
WHERE gamification_role IS NOT NULL;

-- Update RLS policies to allow users to see gamification roles
-- (Already visible via existing policies, no changes needed)

COMMENT ON COLUMN admin_users.gamification_role IS 
'Admin-assigned gamification team role (content-curator, community-moderator, tech-support, campus-ambassador). Displays on profile and leaderboard.';
