-- Add batch column to community_posts table for batch/year-based organization
-- This will store values like 'FA22-BSE', 'SP23-BSEE', etc.

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS batch TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_community_posts_batch ON community_posts(batch);

-- Add comment for documentation
COMMENT ON COLUMN community_posts.batch IS 'Batch identifier for posts (e.g., FA22-BSE, SP23-BSEE)';