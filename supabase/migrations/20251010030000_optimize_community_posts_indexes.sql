-- Optimize community_posts_enhanced table indexes for better query performance
-- This migration adds indexes to commonly queried columns to reduce CPU usage and improve response times

-- Index on community posts created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts_enhanced(created_at DESC);

-- Index on community posts campus_id and created_at for campus-based queries
CREATE INDEX IF NOT EXISTS idx_community_posts_campus_created ON community_posts_enhanced(campus_id, created_at DESC);

-- Index on community posts department_id and created_at for department-based queries
CREATE INDEX IF NOT EXISTS idx_community_posts_department_created ON community_posts_enhanced(department_id, created_at DESC);

-- Index on community posts user_id for user-based queries
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts_enhanced(user_id);

-- Index on community posts type for type-based filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts_enhanced(type);

-- Index on community posts likes_count for popular posts
CREATE INDEX IF NOT EXISTS idx_community_posts_likes_count ON community_posts_enhanced(likes_count DESC);

-- Index on community posts comments_count for active posts
CREATE INDEX IF NOT EXISTS idx_community_posts_comments_count ON community_posts_enhanced(comments_count DESC);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_community_posts_campus_type_created ON community_posts_enhanced(campus_id, type, created_at DESC);

COMMENT ON INDEX idx_community_posts_created_at IS 'Index for faster post sorting by creation time';
COMMENT ON INDEX idx_community_posts_campus_created IS 'Index for campus-based post queries';
COMMENT ON INDEX idx_community_posts_department_created IS 'Index for department-based post queries';
COMMENT ON INDEX idx_community_posts_user_id IS 'Index for user-based post queries';
COMMENT ON INDEX idx_community_posts_type IS 'Index for type-based post filtering';
COMMENT ON INDEX idx_community_posts_likes_count IS 'Index for popular posts sorting';
COMMENT ON INDEX idx_community_posts_comments_count IS 'Index for active posts sorting';
COMMENT ON INDEX idx_community_posts_campus_type_created IS 'Composite index for common query patterns';