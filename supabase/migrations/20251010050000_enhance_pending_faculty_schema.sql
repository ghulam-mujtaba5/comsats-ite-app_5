-- Enhance pending_faculty table schema to match full faculty profile fields
-- This migration adds missing fields to support comprehensive faculty submissions

-- Add new columns to pending_faculty table
ALTER TABLE pending_faculty 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS office TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT[],
ADD COLUMN IF NOT EXISTS courses TEXT[],
ADD COLUMN IF NOT EXISTS education TEXT[],
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Update comments for documentation
COMMENT ON COLUMN pending_faculty.title IS 'Faculty title/designation (Professor, Associate Professor, etc.)';
COMMENT ON COLUMN pending_faculty.office IS 'Office location/room number';
COMMENT ON COLUMN pending_faculty.specialization IS 'Array of specialization areas';
COMMENT ON COLUMN pending_faculty.courses IS 'Array of courses taught';
COMMENT ON COLUMN pending_faculty.education IS 'Array of educational qualifications';
COMMENT ON COLUMN pending_faculty.experience IS 'Years of experience description';
COMMENT ON COLUMN pending_faculty.profile_image IS 'URL to faculty profile image';

-- Update the unique constraint to include more fields for better duplicate detection
ALTER TABLE pending_faculty DROP CONSTRAINT IF EXISTS pending_faculty_name_campus_id_key;
ALTER TABLE pending_faculty ADD CONSTRAINT pending_faculty_unique_submission 
  UNIQUE(name, department, campus_id);