-- Multi-Campus and Multi-Department System
-- This migration adds support for all COMSATS campuses and departments

-- ============================================================================
-- CAMPUSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- e.g., 'LHR', 'ISB', 'ATK'
  city TEXT NOT NULL,
  full_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Lahore will be default
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campuses_code ON campuses(code);
CREATE INDEX IF NOT EXISTS idx_campuses_is_active ON campuses(is_active);
CREATE INDEX IF NOT EXISTS idx_campuses_is_default ON campuses(is_default);

-- ============================================================================
-- DEPARTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL, -- e.g., 'CS', 'SE', 'EE', 'PHARMACY'
  full_name TEXT NOT NULL,
  description TEXT,
  head_of_department TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campus_id, code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_departments_campus_id ON departments(campus_id);
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);

-- ============================================================================
-- PROGRAMS TABLE (Degree Programs per Department)
-- ============================================================================
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., 'BS Computer Science', 'PharmD'
  code TEXT NOT NULL, -- e.g., 'BSCS', 'PHARMD'
  degree_type TEXT NOT NULL CHECK (degree_type IN ('BS', 'MS', 'PhD', 'PharmD', 'BBA', 'MBA')),
  duration_years INTEGER NOT NULL DEFAULT 4,
  total_credit_hours INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(department_id, code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_programs_department_id ON programs(department_id);
CREATE INDEX IF NOT EXISTS idx_programs_code ON programs(code);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON programs(is_active);

-- ============================================================================
-- UPDATE EXISTING TABLES TO SUPPORT MULTI-CAMPUS
-- ============================================================================

-- Add campus_id and department_id to faculty
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);
CREATE INDEX IF NOT EXISTS idx_faculty_campus_id ON faculty(campus_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department_id ON faculty(department_id);

-- Add campus_id and department_id to past_papers
ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);
CREATE INDEX IF NOT EXISTS idx_past_papers_campus_id ON past_papers(campus_id);
CREATE INDEX IF NOT EXISTS idx_past_papers_department_id ON past_papers(department_id);

-- Add campus_id to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);
CREATE INDEX IF NOT EXISTS idx_courses_campus_id ON courses(campus_id);
CREATE INDEX IF NOT EXISTS idx_courses_department_id ON courses(department_id);

-- Add campus_id to community_posts
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);
CREATE INDEX IF NOT EXISTS idx_community_posts_campus_id ON community_posts(campus_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_department_id ON community_posts(department_id);

-- Add campus_id to lost_found_items
DO $$ BEGIN
  ALTER TABLE lost_found_items ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_lost_found_items_campus_id ON lost_found_items(campus_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Add campus_id to news_events (if table exists)
DO $$ BEGIN
  ALTER TABLE news_events ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_news_events_campus_id ON news_events(campus_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Add campus_id to resources
DO $$ BEGIN
  ALTER TABLE resources ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
  ALTER TABLE resources ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_resources_campus_id ON resources(campus_id);
  CREATE INDEX IF NOT EXISTS idx_resources_department_id ON resources(department_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Add campus_id to guidance_content
DO $$ BEGIN
  ALTER TABLE guidance_content ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_guidance_content_campus_id ON guidance_content(campus_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Add campus_id to student_support_resources
DO $$ BEGIN
  ALTER TABLE student_support_resources ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_student_support_campus_id ON student_support_resources(campus_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Add campus_id to help_desk_tickets
DO $$ BEGIN
  ALTER TABLE help_desk_tickets ADD COLUMN IF NOT EXISTS campus_id UUID REFERENCES campuses(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_help_desk_tickets_campus_id ON help_desk_tickets(campus_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- ============================================================================
-- USER CAMPUS/DEPARTMENT PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campus_id UUID REFERENCES campuses(id),
  department_id UUID REFERENCES departments(id),
  program_id UUID REFERENCES programs(id),
  semester INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_campus_id ON user_preferences(campus_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
DROP TRIGGER IF EXISTS campuses_updated_at ON campuses;
CREATE TRIGGER campuses_updated_at BEFORE UPDATE ON campuses
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS departments_updated_at ON departments;
CREATE TRIGGER departments_updated_at BEFORE UPDATE ON departments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS programs_updated_at ON programs;
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS user_preferences_updated_at ON user_preferences;
CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Anyone can view active campuses
DROP POLICY IF EXISTS "Anyone can view active campuses" ON campuses;
CREATE POLICY "Anyone can view active campuses" ON campuses
  FOR SELECT USING (is_active = true);

-- Anyone can view active departments
DROP POLICY IF EXISTS "Anyone can view active departments" ON departments;
CREATE POLICY "Anyone can view active departments" ON departments
  FOR SELECT USING (is_active = true);

-- Anyone can view active programs
DROP POLICY IF EXISTS "Anyone can view active programs" ON programs;
CREATE POLICY "Anyone can view active programs" ON programs
  FOR SELECT USING (is_active = true);

-- Users can view and manage their own preferences
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE campuses IS 'COMSATS campuses across Pakistan';
COMMENT ON TABLE departments IS 'Academic departments within each campus';
COMMENT ON TABLE programs IS 'Degree programs offered by departments';
COMMENT ON TABLE user_preferences IS 'User campus and department preferences';
