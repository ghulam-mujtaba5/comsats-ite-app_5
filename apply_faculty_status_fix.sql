-- ==========================================
-- Faculty Status Column Fix
-- ==========================================

-- This script adds a status column to the faculty table to fix the error:
-- "column faculty.status does not exist"

-- Add status column to faculty table
-- This makes the faculty approval workflow consistent with the pending_faculty table
ALTER TABLE faculty 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty(status);

-- Add comment for documentation
COMMENT ON COLUMN faculty.status IS 'Approval status: pending, approved, or rejected';

-- Update existing faculty to have approved status (they were already in the system)
UPDATE faculty SET status = 'approved' WHERE status IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'faculty' AND column_name = 'status';

-- Count faculty by status
SELECT status, COUNT(*) as count 
FROM faculty 
GROUP BY status;