-- Enhance community posts table with modern social media features
-- This migration adds advanced features like reactions, bookmarks, and rich content support

-- Add new columns to community_posts table
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}', -- Array of media URLs (images, videos)
ADD COLUMN IF NOT EXISTS link_preview JSONB, -- Link preview data
ADD COLUMN IF NOT EXISTS location TEXT, -- Post location
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false, -- Whether post has been edited
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ, -- When post was last edited
ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT false, -- Whether post is pinned
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ, -- When to publish scheduled post
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ, -- When post expires
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public', -- public, friends, private
ADD COLUMN IF NOT EXISTS reaction_counts JSONB DEFAULT '{}', -- Reaction counts by type
ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER DEFAULT 0, -- Number of bookmarks
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0; -- Number of shares

-- Create community_post_reactions table for advanced reactions
CREATE TABLE IF NOT EXISTS community_post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL, -- like, love, haha, wow, sad, angry
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Create community_post_bookmarks table
CREATE TABLE IF NOT EXISTS community_post_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create community_post_shares table
CREATE TABLE IF NOT EXISTS community_post_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_to TEXT, -- profile, group, event
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_media_urls ON community_posts USING GIN(media_urls);
CREATE INDEX IF NOT EXISTS idx_community_posts_location ON community_posts(location);
CREATE INDEX IF NOT EXISTS idx_community_posts_pinned ON community_posts(pinned);
CREATE INDEX IF NOT EXISTS idx_community_posts_scheduled_at ON community_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_expires_at ON community_posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_visibility ON community_posts(visibility);
CREATE INDEX IF NOT EXISTS idx_community_posts_reaction_counts ON community_posts USING GIN(reaction_counts);
CREATE INDEX IF NOT EXISTS idx_community_post_reactions_post_id ON community_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_reactions_user_id ON community_post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_post_reactions_type ON community_post_reactions(reaction_type);
CREATE INDEX IF NOT EXISTS idx_community_post_bookmarks_post_id ON community_post_bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_bookmarks_user_id ON community_post_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_community_post_shares_post_id ON community_post_shares(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_shares_user_id ON community_post_shares(user_id);

-- Update the trigger function to handle updated_at
CREATE OR REPLACE FUNCTION update_community_posts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS community_posts_updated_at ON community_posts;
CREATE TRIGGER community_posts_updated_at 
BEFORE UPDATE ON community_posts 
FOR EACH ROW EXECUTE FUNCTION update_community_posts_timestamp();

-- RLS Policies for new tables
ALTER TABLE community_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_shares ENABLE ROW LEVEL SECURITY;

-- Users can create reactions
CREATE POLICY "Users can create reactions" ON community_post_reactions 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can delete their own reactions
CREATE POLICY "Users can delete own reactions" ON community_post_reactions 
FOR DELETE TO authenticated 
USING (user_id = auth.uid());

-- Users can view reactions
CREATE POLICY "Public can view reactions" ON community_post_reactions 
FOR SELECT TO public 
USING (true);

-- Users can create bookmarks
CREATE POLICY "Users can create bookmarks" ON community_post_bookmarks 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON community_post_bookmarks 
FOR DELETE TO authenticated 
USING (user_id = auth.uid());

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON community_post_bookmarks 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- Users can create shares
CREATE POLICY "Users can create shares" ON community_post_shares 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can view shares
CREATE POLICY "Public can view shares" ON community_post_shares 
FOR SELECT TO public 
USING (true);

-- Update existing posts with default reaction counts
UPDATE community_posts 
SET reaction_counts = jsonb_build_object(
    'like', likes,
    'love', 0,
    'haha', 0,
    'wow', 0,
    'sad', 0,
    'angry', 0
) 
WHERE reaction_counts = '{}';

COMMENT ON TABLE community_post_reactions IS 'User reactions to community posts';
COMMENT ON TABLE community_post_bookmarks IS 'User bookmarks of community posts';
COMMENT ON TABLE community_post_shares IS 'User shares of community posts';
COMMENT ON COLUMN community_posts.media_urls IS 'Array of media URLs attached to the post';
COMMENT ON COLUMN community_posts.link_preview IS 'Link preview data for URLs in the post';
COMMENT ON COLUMN community_posts.location IS 'Location where the post was created';
COMMENT ON COLUMN community_posts.is_edited IS 'Whether the post has been edited';
COMMENT ON COLUMN community_posts.edited_at IS 'When the post was last edited';
COMMENT ON COLUMN community_posts.pinned IS 'Whether the post is pinned to the top';
COMMENT ON COLUMN community_posts.scheduled_at IS 'When to publish a scheduled post';
COMMENT ON COLUMN community_posts.expires_at IS 'When the post expires and is automatically deleted';
COMMENT ON COLUMN community_posts.visibility IS 'Visibility setting for the post';
COMMENT ON COLUMN community_posts.reaction_counts IS 'Counts of reactions by type';
COMMENT ON COLUMN community_posts.bookmarks_count IS 'Number of times the post has been bookmarked';
COMMENT ON COLUMN community_posts.shares_count IS 'Number of times the post has been shared';