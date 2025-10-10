-- Add campus_id to student_portal_resources for multi-campus support

-- Add campus_id column to student_portal_resources
ALTER TABLE student_portal_resources 
ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_student_portal_resources_campus_id 
ON student_portal_resources(campus_id);

-- Update RLS policy to include campus_id filtering
DROP POLICY IF EXISTS "Public can view active resources" ON student_portal_resources;

-- Allow public to view active resources, with optional campus filtering
CREATE POLICY "Public can view active resources" ON student_portal_resources 
FOR SELECT TO public 
USING (status = 'active');

COMMENT ON TABLE student_portal_resources IS 'Links to official COMSATS services with multi-campus support';