-- Update existing community posts with user avatars
-- This migration updates all existing posts to use the user's current avatar URL

-- First, add a temporary column to store user_id for existing posts without avatar_url
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS temp_user_id UUID;

-- Update the temporary column with user_id where avatar_url is missing
UPDATE community_posts 
SET temp_user_id = user_id 
WHERE avatar_url IS NULL OR avatar_url = '';

-- Update posts with avatar URLs from user metadata (if available)
DO $$
BEGIN
  -- Check if the auth.users table has the user_metadata column
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'raw_user_meta_data'
  ) THEN
    -- Use raw_user_meta_data if available
    UPDATE community_posts cp
    SET avatar_url = (
        SELECT COALESCE(u.raw_user_meta_data->>'avatar_url', '/student-avatar.png')
        FROM auth.users u
        WHERE u.id = cp.temp_user_id
    )
    WHERE cp.temp_user_id IS NOT NULL;
  ELSIF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'user_metadata'
  ) THEN
    -- Use user_metadata if available
    UPDATE community_posts cp
    SET avatar_url = (
        SELECT COALESCE(u.user_metadata->>'avatar_url', '/student-avatar.png')
        FROM auth.users u
        WHERE u.id = cp.temp_user_id
    )
    WHERE cp.temp_user_id IS NOT NULL;
  ELSE
    -- Set default avatar if no metadata column exists
    UPDATE community_posts
    SET avatar_url = '/student-avatar.png'
    WHERE temp_user_id IS NOT NULL;
  END IF;
END $$;

-- Set default avatar for any remaining posts without avatar_url
UPDATE community_posts
SET avatar_url = '/student-avatar.png'
WHERE avatar_url IS NULL OR avatar_url = '';

-- Remove the temporary column
ALTER TABLE community_posts DROP COLUMN IF EXISTS temp_user_id;

-- Add comment for documentation
COMMENT ON COLUMN community_posts.avatar_url IS 'User avatar URL for displaying in community posts (from Google OAuth or default)';

-- Verify the update
-- SELECT COUNT(*) as posts_with_avatar FROM community_posts WHERE avatar_url IS NOT NULL;