-- Optimize post_reactions table indexes for better query performance
-- This migration adds indexes to commonly queried columns to reduce CPU usage and improve response times

-- Index on post_reactions post_id for faster reaction counting
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);

-- Index on post_reactions user_id for faster user reaction queries
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

-- Index on post_reactions reaction_type for faster type-based queries
CREATE INDEX IF NOT EXISTS idx_post_reactions_reaction_type ON post_reactions(reaction_type);

-- Composite index for checking if user has reacted to a post
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_post ON post_reactions(user_id, post_id);

-- Composite index for counting reactions by type
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_type ON post_reactions(post_id, reaction_type);

COMMENT ON INDEX idx_post_reactions_post_id IS 'Index for faster reaction counting on posts';
COMMENT ON INDEX idx_post_reactions_user_id IS 'Index for faster user reaction queries';
COMMENT ON INDEX idx_post_reactions_reaction_type IS 'Index for faster type-based reaction queries';
COMMENT ON INDEX idx_post_reactions_user_post IS 'Composite index for checking user reactions';
COMMENT ON INDEX idx_post_reactions_post_type IS 'Composite index for counting reactions by type';