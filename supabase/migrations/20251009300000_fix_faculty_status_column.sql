-- Add status column to faculty table to fix "column faculty.status does not exist" error
-- This enables faculty approval workflow similar to pending_faculty table

-- Add the status column with proper constraints
ALTER TABLE faculty 
ADD COLUMN IF NOT EXISTS status TEXT 
DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);

-- Add helpful comment
COMMENT ON COLUMN faculty.status IS 'Faculty approval status: pending, approved, or rejected. Default is approved for existing faculty.';

-- Update any existing NULL values to approved
UPDATE faculty 
SET status = 'approved' 
WHERE status IS NULL;

-- Create RLS policy to show only approved faculty to public
DROP POLICY IF EXISTS "Allow public read access to approved faculty" ON faculty;

CREATE POLICY "Allow public read access to approved faculty"
ON faculty FOR SELECT
USING (status = 'approved');
