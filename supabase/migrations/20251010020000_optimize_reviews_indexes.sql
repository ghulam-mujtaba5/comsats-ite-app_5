-- Optimize reviews table indexes for better query performance
-- This migration adds indexes to commonly queried columns to reduce CPU usage and improve response times

-- Index on reviews faculty_id and created_at for faster faculty profile loading
CREATE INDEX IF NOT EXISTS idx_reviews_faculty_created ON reviews(faculty_id, created_at DESC);

-- Index on reviews status and created_at for faster approved reviews queries
CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON reviews(status, created_at DESC);

-- Index on reviews rating for faster rating-based queries
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Index on reviews would_recommend for faster recommendation queries
CREATE INDEX IF NOT EXISTS idx_reviews_would_recommend ON reviews(would_recommend);

-- Index on reviews helpful for faster helpful review sorting
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON reviews(helpful DESC);

-- Composite index for common query patterns in faculty stats
CREATE INDEX IF NOT EXISTS idx_reviews_faculty_status_rating ON reviews(faculty_id, status, rating);

COMMENT ON INDEX idx_reviews_faculty_created IS 'Index for faster faculty reviews loading';
COMMENT ON INDEX idx_reviews_status_created IS 'Index for faster approved reviews queries';
COMMENT ON INDEX idx_reviews_rating IS 'Index for faster rating-based queries';
COMMENT ON INDEX idx_reviews_would_recommend IS 'Index for faster recommendation queries';
COMMENT ON INDEX idx_reviews_helpful IS 'Index for faster helpful review sorting';
COMMENT ON INDEX idx_reviews_faculty_status_rating IS 'Composite index for faculty stats queries';