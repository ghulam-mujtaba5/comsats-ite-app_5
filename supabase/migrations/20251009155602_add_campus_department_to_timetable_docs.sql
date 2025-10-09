-- Add campus_id and department_id columns to timetable_docs table
-- This migration adds multi-campus support to timetable documents

-- Add campus_id column with foreign key reference to campuses table
ALTER TABLE timetable_docs ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);

-- Add department_id column with foreign key reference to departments table
ALTER TABLE timetable_docs ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_timetable_docs_campus_id ON timetable_docs(campus_id);
CREATE INDEX IF NOT EXISTS idx_timetable_docs_department_id ON timetable_docs(department_id);

-- Add comments to describe the new columns
COMMENT ON COLUMN timetable_docs.campus_id IS 'Foreign key to campuses table for multi-campus support';
COMMENT ON COLUMN timetable_docs.department_id IS 'Foreign key to departments table for department filtering';