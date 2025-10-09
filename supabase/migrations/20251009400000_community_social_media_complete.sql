-- ============================================
-- COMSATS Community Social Media Platform
-- Complete Database Schema with Advanced Features
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- USER PROFILES & SOCIAL GRAPH
-- ============================================

-- Enhanced user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    cover_photo_url TEXT,
    website VARCHAR(255),
    location VARCHAR(100),
    campus_id UUID REFERENCES campuses(id),
    department_id UUID REFERENCES departments(id),
    batch VARCHAR(20),
    semester INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}'::JSONB,
    reputation_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User followers/following table
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- User blocks table
CREATE TABLE IF NOT EXISTS user_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- ============================================
-- POSTS & MEDIA
-- ============================================

-- Enhanced posts table with media support
CREATE TABLE IF NOT EXISTS community_posts_enhanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    type VARCHAR(50) DEFAULT 'general',
    media JSONB DEFAULT '[]'::JSONB, -- Array of {type, url, thumbnail}
    location VARCHAR(255),
    feeling VARCHAR(50),
    tagged_users UUID[] DEFAULT '{}',
    visibility VARCHAR(20) DEFAULT 'public', -- public, followers, private
    campus_id UUID REFERENCES campuses(id),
    department_id UUID REFERENCES departments(id),
    batch VARCHAR(20),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON community_posts_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_campus_id ON community_posts_enhanced(campus_id);
CREATE INDEX IF NOT EXISTS idx_posts_department_id ON community_posts_enhanced(department_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON community_posts_enhanced(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON community_posts_enhanced(type);
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON community_posts_enhanced USING gin(to_tsvector('english', content));

-- ============================================
-- REACTIONS (LIKE, LOVE, LAUGH, etc.)
-- ============================================

CREATE TABLE IF NOT EXISTS post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts_enhanced(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL, -- like, love, laugh, wow, sad, angry
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON post_reactions(user_id);

-- ============================================
-- COMMENTS & REPLIES
-- ============================================

CREATE TABLE IF NOT EXISTS post_comments_enhanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts_enhanced(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES post_comments_enhanced(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media JSONB DEFAULT '[]'::JSONB,
    mentions UUID[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON post_comments_enhanced(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON post_comments_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON post_comments_enhanced(parent_comment_id);

-- Comment reactions
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES post_comments_enhanced(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- ============================================
-- STORIES
-- ============================================

CREATE TABLE IF NOT EXISTS user_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL, -- image, video
    thumbnail_url TEXT,
    duration INTEGER, -- for videos
    caption TEXT,
    views_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stories_user_id ON user_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON user_stories(expires_at);

-- Story views
CREATE TABLE IF NOT EXISTS story_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES user_stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(story_id, viewer_id)
);

-- ============================================
-- DIRECT MESSAGES
-- ============================================

-- Conversations/Threads
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) DEFAULT 'direct', -- direct, group
    name VARCHAR(100),
    avatar_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_muted BOOLEAN DEFAULT FALSE,
    UNIQUE(conversation_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    media JSONB DEFAULT '[]'::JSONB,
    reply_to_id UUID REFERENCES messages(id),
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    reactions JSONB DEFAULT '{}'::JSONB, -- {user_id: reaction_type}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications_enhanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- like, comment, follow, mention, etc.
    content TEXT,
    entity_type VARCHAR(50), -- post, comment, story, etc.
    entity_id UUID,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications_enhanced(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications_enhanced(is_read);

-- ============================================
-- BOOKMARKS & SAVES
-- ============================================

CREATE TABLE IF NOT EXISTS saved_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES community_posts_enhanced(id) ON DELETE CASCADE,
    collection_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- ============================================
-- HASHTAGS & TRENDS
-- ============================================

CREATE TABLE IF NOT EXISTS hashtags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag VARCHAR(100) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    trending_score FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hashtags_tag ON hashtags(tag);
CREATE INDEX IF NOT EXISTS idx_hashtags_trending_score ON hashtags(trending_score DESC);

-- Post hashtags junction table
CREATE TABLE IF NOT EXISTS post_hashtags (
    post_id UUID NOT NULL REFERENCES community_posts_enhanced(id) ON DELETE CASCADE,
    hashtag_id UUID NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY(post_id, hashtag_id)
);

-- ============================================
-- LIVE STREAMING
-- ============================================

CREATE TABLE IF NOT EXISTS live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    stream_key TEXT UNIQUE NOT NULL,
    stream_url TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, ended
    viewers_count INTEGER DEFAULT 0,
    max_viewers INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS FOR COUNTERS
-- ============================================

-- Update likes count on posts
CREATE OR REPLACE FUNCTION update_post_reactions_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts_enhanced 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts_enhanced 
        SET likes_count = GREATEST(0, likes_count - 1) 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_reactions_count
AFTER INSERT OR DELETE ON post_reactions
FOR EACH ROW EXECUTE FUNCTION update_post_reactions_count();

-- Update comments count on posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts_enhanced 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts_enhanced 
        SET comments_count = GREATEST(0, comments_count - 1) 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON post_comments_enhanced
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Update replies count on comments
CREATE OR REPLACE FUNCTION update_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
        UPDATE post_comments_enhanced 
        SET replies_count = replies_count + 1 
        WHERE id = NEW.parent_comment_id;
    ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
        UPDATE post_comments_enhanced 
        SET replies_count = GREATEST(0, replies_count - 1) 
        WHERE id = OLD.parent_comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_replies_count
AFTER INSERT OR DELETE ON post_comments_enhanced
FOR EACH ROW EXECUTE FUNCTION update_comment_replies_count();

-- Update story views count
CREATE OR REPLACE FUNCTION update_story_views_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_stories 
    SET views_count = views_count + 1 
    WHERE id = NEW.story_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_story_views_count
AFTER INSERT ON story_views
FOR EACH ROW EXECUTE FUNCTION update_story_views_count();

-- Update hashtag usage count
CREATE OR REPLACE FUNCTION update_hashtag_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hashtags 
        SET usage_count = usage_count + 1,
            trending_score = usage_count * 0.5 + (EXTRACT(EPOCH FROM (NOW() - updated_at)) / 3600) * 0.5,
            updated_at = NOW()
        WHERE id = NEW.hashtag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE hashtags 
        SET usage_count = GREATEST(0, usage_count - 1),
            updated_at = NOW()
        WHERE id = OLD.hashtag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hashtag_usage
AFTER INSERT OR DELETE ON post_hashtags
FOR EACH ROW EXECUTE FUNCTION update_hashtag_usage();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user feed (posts from followed users)
CREATE OR REPLACE FUNCTION get_user_feed(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    content TEXT,
    type VARCHAR(50),
    media JSONB,
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    author_username VARCHAR(50),
    author_avatar TEXT,
    user_reaction VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        p.content,
        p.type,
        p.media,
        p.likes_count,
        p.comments_count,
        p.shares_count,
        p.created_at,
        up.username as author_username,
        up.avatar_url as author_avatar,
        pr.reaction_type as user_reaction
    FROM community_posts_enhanced p
    INNER JOIN user_profiles up ON p.user_id = up.user_id
    LEFT JOIN post_reactions pr ON p.id = pr.post_id AND pr.user_id = p_user_id
    WHERE p.user_id IN (
        SELECT following_id FROM user_follows WHERE follower_id = p_user_id
    )
    OR p.user_id = p_user_id
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Get trending posts
CREATE OR REPLACE FUNCTION get_trending_posts(
    p_limit INTEGER DEFAULT 20,
    p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    content TEXT,
    type VARCHAR(50),
    media JSONB,
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    engagement_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        p.content,
        p.type,
        p.media,
        p.likes_count,
        p.comments_count,
        p.shares_count,
        (p.likes_count * 1.0 + p.comments_count * 2.0 + p.shares_count * 3.0) / 
        (EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600 + 2) as engagement_score,
        p.created_at
    FROM community_posts_enhanced p
    WHERE p.created_at >= NOW() - INTERVAL '1 hour' * p_hours
    ORDER BY engagement_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    actor_id UUID,
    type VARCHAR(50),
    content TEXT,
    entity_type VARCHAR(50),
    entity_id UUID,
    action_url TEXT,
    is_read BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    actor_username VARCHAR(50),
    actor_avatar TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.actor_id,
        n.type,
        n.content,
        n.entity_type,
        n.entity_id,
        n.action_url,
        n.is_read,
        n.created_at,
        up.username as actor_username,
        up.avatar_url as actor_avatar
    FROM notifications_enhanced n
    LEFT JOIN user_profiles up ON n.actor_id = up.user_id
    WHERE n.user_id = p_user_id
    ORDER BY n.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view public profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Users can view posts" ON community_posts_enhanced
    FOR SELECT USING (
        visibility = 'public' OR
        user_id = auth.uid() OR
        (visibility = 'followers' AND user_id IN (
            SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
        ))
    );

CREATE POLICY "Users can create posts" ON community_posts_enhanced
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON community_posts_enhanced
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON community_posts_enhanced
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reactions
CREATE POLICY "Users can view reactions" ON post_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can add reactions" ON post_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions" ON post_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Users can view comments" ON post_comments_enhanced
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON post_comments_enhanced
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON post_comments_enhanced
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON post_comments_enhanced
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications_enhanced
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications_enhanced
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view conversation messages" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for stories
CREATE POLICY "Users can view stories" ON user_stories
    FOR SELECT USING (
        expires_at > NOW() AND (
            user_id = auth.uid() OR
            user_id IN (
                SELECT following_id FROM user_follows WHERE follower_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create stories" ON user_stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON user_stories
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
