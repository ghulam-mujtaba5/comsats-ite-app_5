-- Add avatar_url column to community_posts table
-- This will store the user's avatar URL for displaying in community posts

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_community_posts_avatar_url ON community_posts(avatar_url);

-- Add comment for documentation
COMMENT ON COLUMN community_posts.avatar_url IS 'User avatar URL for displaying in community posts';