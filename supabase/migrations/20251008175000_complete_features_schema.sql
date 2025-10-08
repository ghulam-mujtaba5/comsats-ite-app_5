-- Schema for all incomplete features

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    amount TEXT NOT NULL,
    deadline DATE,
    application_url TEXT,
    category TEXT NOT NULL, -- need-based, merit-based, specific-program
    department TEXT,
    status TEXT DEFAULT 'active', -- active, expired, closed
    requirements TEXT[], -- array of requirements
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);

-- Merit List table for admissions
CREATE TABLE IF NOT EXISTS merit_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    session TEXT NOT NULL, -- Fall, Spring
    program TEXT NOT NULL,
    campus TEXT NOT NULL,
    merit_position INTEGER NOT NULL,
    aggregate_marks DECIMAL(5,2) NOT NULL,
    student_name TEXT, -- optional, for privacy can be null
    category TEXT DEFAULT 'open', -- open, reserved, etc
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merit_lists_year ON merit_lists(year DESC);
CREATE INDEX IF NOT EXISTS idx_merit_lists_program ON merit_lists(program);
CREATE INDEX IF NOT EXISTS idx_merit_lists_aggregate ON merit_lists(aggregate_marks DESC);
CREATE INDEX IF NOT EXISTS idx_merit_lists_campus ON merit_lists(campus);

-- Fee Challans table
CREATE TABLE IF NOT EXISTS fee_challans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    semester TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    challan_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, paid, overdue
    late_fee DECIMAL(10,2) DEFAULT 0,
    payment_date TIMESTAMPTZ,
    payment_reference TEXT,
    bank_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fee_challans_user ON fee_challans(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_challans_status ON fee_challans(status);
CREATE INDEX IF NOT EXISTS idx_fee_challans_due_date ON fee_challans(due_date);
CREATE INDEX IF NOT EXISTS idx_fee_challans_student_id ON fee_challans(student_id);

-- LMS Troubleshooting guides
CREATE TABLE IF NOT EXISTS lms_troubleshooting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    solution TEXT NOT NULL,
    category TEXT NOT NULL, -- login, assignments, quizzes, grades, access
    difficulty TEXT DEFAULT 'intermediate', -- beginner, intermediate, advanced
    steps TEXT[], -- array of step-by-step instructions
    screenshots_urls TEXT[], -- array of screenshot URLs
    video_url TEXT,
    tags TEXT[],
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published', -- draft, published, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_lms_troubleshooting_category ON lms_troubleshooting(category);
CREATE INDEX IF NOT EXISTS idx_lms_troubleshooting_status ON lms_troubleshooting(status);

-- Student portal resources
CREATE TABLE IF NOT EXISTS student_portal_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL, -- cuonline, email, lms, library, etc
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0,
    is_external BOOLEAN DEFAULT true,
    requires_vpn BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portal_resources_category ON student_portal_resources(category);
CREATE INDEX IF NOT EXISTS idx_portal_resources_sort ON student_portal_resources(sort_order);

-- Community post comments (for threaded discussions)
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE, -- for nested comments
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user ON community_comments(user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER scholarships_updated_at BEFORE UPDATE ON scholarships 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS merit_lists_updated_at ON merit_lists;
CREATE TRIGGER merit_lists_updated_at BEFORE UPDATE ON merit_lists
FOR EACH ROW EXECUTE FUNCTION update_timestamp();DROP TRIGGER IF EXISTS fee_challans_updated_at ON fee_challans;
CREATE TRIGGER fee_challans_updated_at BEFORE UPDATE ON fee_challans
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS lms_troubleshooting_updated_at ON lms_troubleshooting;
CREATE TRIGGER lms_troubleshooting_updated_at BEFORE UPDATE ON lms_troubleshooting
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS student_portal_resources_updated_at ON student_portal_resources;
CREATE TRIGGER student_portal_resources_updated_at BEFORE UPDATE ON student_portal_resources
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS community_comments_updated_at ON community_comments;
CREATE TRIGGER community_comments_updated_at BEFORE UPDATE ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();-- RLS Policies
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE merit_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_troubleshooting ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_portal_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Public read for active scholarships
CREATE POLICY "Public can view active scholarships" ON scholarships 
FOR SELECT TO public 
USING (status = 'active');

-- Public read for merit lists
CREATE POLICY "Public can view merit lists" ON merit_lists 
FOR SELECT TO public 
USING (true);

-- Users can view their own fee challans
CREATE POLICY "Users can view own fee challans" ON fee_challans 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- Public read for published troubleshooting guides
CREATE POLICY "Public can view published guides" ON lms_troubleshooting 
FOR SELECT TO public 
USING (status = 'published');

-- Public read for active portal resources
CREATE POLICY "Public can view active resources" ON student_portal_resources 
FOR SELECT TO public 
USING (status = 'active');

-- Public read for community comments
CREATE POLICY "Public can view comments" ON community_comments 
FOR SELECT TO public 
USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated can create comments" ON community_comments 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can update/delete their own comments
CREATE POLICY "Users can update own comments" ON community_comments 
FOR UPDATE TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments" ON community_comments 
FOR DELETE TO authenticated 
USING (user_id = auth.uid());

COMMENT ON TABLE scholarships IS 'Scholarship opportunities for students';
COMMENT ON TABLE merit_lists IS 'Merit lists for admissions';
COMMENT ON TABLE fee_challans IS 'Fee payment challans and records';
COMMENT ON TABLE lms_troubleshooting IS 'Moodle/LMS troubleshooting guides';
COMMENT ON TABLE student_portal_resources IS 'Links to official COMSATS services';
COMMENT ON TABLE community_comments IS 'Comments on community posts';
