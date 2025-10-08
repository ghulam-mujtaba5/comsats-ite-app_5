-- Verify and create necessary tables and columns for the application

-- Ensure past_papers table has all required columns
DO $$ 
BEGIN
    -- Add exam_type column if it doesn't exist (for backward compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='past_papers' AND column_name='exam_type') THEN
        ALTER TABLE past_papers ADD COLUMN exam_type TEXT;
    END IF;
    
    -- Ensure type column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='past_papers' AND column_name='type') THEN
        ALTER TABLE past_papers ADD COLUMN type TEXT;
    END IF;
END $$;

-- Update exam_type from type column if needed
UPDATE past_papers 
SET exam_type = type 
WHERE exam_type IS NULL AND type IS NOT NULL;

-- Create index on course_code if not exists
CREATE INDEX IF NOT EXISTS idx_past_papers_course_code ON past_papers(course_code);
CREATE INDEX IF NOT EXISTS idx_past_papers_type ON past_papers(type);
CREATE INDEX IF NOT EXISTS idx_past_papers_exam_type ON past_papers(exam_type);

-- Ensure lost_found_items has image_url (already exists per schema)
-- This is just a verification comment

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    credit_hours INTEGER DEFAULT 3,
    department TEXT,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on course code
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);

-- Add RLS policies for courses if needed
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courses
DROP POLICY IF EXISTS "Public can view courses" ON courses;
CREATE POLICY "Public can view courses" 
ON courses FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users to insert courses
DROP POLICY IF EXISTS "Authenticated users can insert courses" ON courses;
CREATE POLICY "Authenticated users can insert courses" 
ON courses FOR INSERT 
TO authenticated 
WITH CHECK (true);

COMMENT ON TABLE courses IS 'Academic courses information';
COMMENT ON TABLE past_papers IS 'Past examination papers and academic resources';
COMMENT ON TABLE lost_found_items IS 'Lost and found items posted by students';
