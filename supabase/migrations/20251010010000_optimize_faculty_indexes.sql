-- Optimize faculty table indexes for better query performance
-- This migration adds indexes to commonly queried columns to reduce CPU usage and improve response times

-- Index on faculty name for faster search and sorting
CREATE INDEX IF NOT EXISTS idx_faculty_name ON faculty(name);

-- Index on faculty rating_avg for faster sorting by rating
CREATE INDEX IF NOT EXISTS idx_faculty_rating_avg ON faculty(rating_avg);

-- Index on faculty rating_count for faster sorting by review count
CREATE INDEX IF NOT EXISTS idx_faculty_rating_count ON faculty(rating_count);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_faculty_status_rating ON faculty(status, rating_avg DESC);

-- Index on faculty department and name for department-based searches
CREATE INDEX IF NOT EXISTS idx_faculty_department_name ON faculty(department, name);

-- Index on faculty campus_id and name for campus-based searches
CREATE INDEX IF NOT EXISTS idx_faculty_campus_name ON faculty(campus_id, name);

-- Index on faculty created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_faculty_created_at ON faculty(created_at);

COMMENT ON INDEX idx_faculty_name IS 'Index for faster faculty name searches';
COMMENT ON INDEX idx_faculty_rating_avg IS 'Index for faster sorting by average rating';
COMMENT ON INDEX idx_faculty_rating_count IS 'Index for faster sorting by review count';
COMMENT ON INDEX idx_faculty_status_rating IS 'Composite index for status and rating queries';
COMMENT ON INDEX idx_faculty_department_name IS 'Index for department-based faculty searches';
COMMENT ON INDEX idx_faculty_campus_name IS 'Index for campus-based faculty searches';
COMMENT ON INDEX idx_faculty_created_at IS 'Index for time-based faculty queries';