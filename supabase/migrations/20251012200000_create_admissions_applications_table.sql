-- Create admissions_applications table
CREATE TABLE IF NOT EXISTS admissions_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cnic VARCHAR(20) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    matric_marks DECIMAL(5,2) NOT NULL,
    inter_marks DECIMAL(5,2) NOT NULL,
    entry_test_marks DECIMAL(5,2) NOT NULL,
    aggregate DECIMAL(5,2) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admissions_applications_campus_id ON admissions_applications(campus_id);
CREATE INDEX IF NOT EXISTS idx_admissions_applications_department_id ON admissions_applications(department_id);
CREATE INDEX IF NOT EXISTS idx_admissions_applications_program_id ON admissions_applications(program_id);
CREATE INDEX IF NOT EXISTS idx_admissions_applications_status ON admissions_applications(status);
CREATE INDEX IF NOT EXISTS idx_admissions_applications_created_at ON admissions_applications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE admissions_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for admissions_applications
-- Allow anyone to create applications (public form)
CREATE POLICY "Anyone can create applications" ON admissions_applications
    FOR INSERT WITH CHECK (true);

-- Allow admins to view applications
CREATE POLICY "Admins can view applications" ON admissions_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid() 
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- Allow admins to update applications
CREATE POLICY "Admins can update applications" ON admissions_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid() 
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- Allow admins to delete applications
CREATE POLICY "Admins can delete applications" ON admissions_applications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid() 
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );