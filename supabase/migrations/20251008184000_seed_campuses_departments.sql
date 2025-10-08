-- Seed COMSATS Campuses and Departments
-- Focus: Lahore campus as default, with all major COMSATS campuses

-- ============================================================================
-- INSERT CAMPUSES
-- ============================================================================
INSERT INTO campuses (name, code, city, full_name, address, phone, email, is_active, is_default, display_order) VALUES
-- Lahore Campus (Default and Main Focus)
('COMSATS Lahore', 'LHR', 'Lahore', 'COMSATS University Islamabad, Lahore Campus', 
 'Defence Road, Off Raiwind Road, Lahore', '+92-42-111-001-007', 'info@cuilahore.edu.pk', true, true, 1),

-- Other Major Campuses
('COMSATS Islamabad', 'ISB', 'Islamabad', 'COMSATS University Islamabad', 
 'Park Road, Chak Shahzad, Islamabad', '+92-51-9247000', 'info@comsats.edu.pk', true, false, 2),

('COMSATS Abbottabad', 'ATK', 'Abbottabad', 'COMSATS University Islamabad, Abbottabad Campus', 
 'University Road, Abbottabad', '+92-992-383591-6', 'info@cuiatd.edu.pk', true, false, 3),

('COMSATS Attock', 'ATK2', 'Attock', 'COMSATS University Islamabad, Attock Campus', 
 'Kamra Road, Attock', '+92-57-9316588', 'info@cuiatk.edu.pk', true, false, 4),

('COMSATS Sahiwal', 'SWL', 'Sahiwal', 'COMSATS University Islamabad, Sahiwal Campus', 
 'Off GT Road, Sahiwal', '+92-40-4300214-6', 'info@cuisahiwal.edu.pk', true, false, 5),

('COMSATS Vehari', 'VEH', 'Vehari', 'COMSATS University Islamabad, Vehari Campus', 
 'Vehari', '+92-67-3780614', 'info@cuivehari.edu.pk', true, false, 6),

('COMSATS Wah', 'WAH', 'Wah Cantt', 'COMSATS University Islamabad, Wah Campus', 
 'Quaid Avenue, Wah Cantt', '+92-51-9314001-5', 'info@wah.comsats.edu.pk', true, false, 7),

('COMSATS Virtual', 'VRT', 'Virtual', 'COMSATS University Islamabad, Virtual Campus', 
 'Online Learning', '+92-51-9247000', 'virtual@comsats.edu.pk', true, false, 8)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  full_name = EXCLUDED.full_name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  is_active = EXCLUDED.is_active,
  is_default = EXCLUDED.is_default,
  display_order = EXCLUDED.display_order;

-- ============================================================================
-- INSERT DEPARTMENTS (Focus on Lahore Campus)
-- ============================================================================

-- Get Lahore campus ID
DO $$
DECLARE
  lahore_campus_id UUID;
  islamabad_campus_id UUID;
  dept_id UUID;
BEGIN
  SELECT id INTO lahore_campus_id FROM campuses WHERE code = 'LHR';
  SELECT id INTO islamabad_campus_id FROM campuses WHERE code = 'ISB';

  -- LAHORE CAMPUS DEPARTMENTS
  -- Computer Science Department
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'Offering BS, MS, and PhD programs in Computer Science with focus on AI, Software Engineering, and Cybersecurity',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO NOTHING
  RETURNING id INTO dept_id;

  -- Software Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Software Engineering', 
    'SE', 
    'Department of Software Engineering',
    'Specialized programs in Software Development, DevOps, and Project Management',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Electrical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Electrical Engineering', 
    'EE', 
    'Department of Electrical Engineering',
    'Power Systems, Electronics, Telecommunications, and Control Systems',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Electronics Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Electronics Engineering', 
    'ELE', 
    'Department of Electronics Engineering',
    'Embedded Systems, VLSI Design, and Digital Signal Processing',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Telecom Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Telecom Engineering', 
    'TE', 
    'Department of Telecom Engineering',
    'Wireless Communications, Networking, and 5G Technologies',
    true, 
    5
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Business Administration
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Business Administration', 
    'BBA', 
    'Department of Business Administration',
    'BBA and MBA programs with specializations in Finance, Marketing, and HR',
    true, 
    6
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Mathematics
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Mathematics', 
    'MATH', 
    'Department of Mathematics',
    'Pure and Applied Mathematics, Statistics, and Computational Mathematics',
    true, 
    7
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Physics
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Physics', 
    'PHY', 
    'Department of Physics',
    'Classical, Modern, and Quantum Physics with research opportunities',
    true, 
    8
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Chemistry
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    lahore_campus_id, 
    'Chemistry', 
    'CHEM', 
    'Department of Chemistry',
    'Organic, Inorganic, Physical, and Analytical Chemistry',
    true, 
    9
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- ISLAMABAD CAMPUS - PHARMACY (Example of campus-specific department)
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Pharmacy', 
    'PHARM', 
    'Department of Pharmacy',
    'PharmD program with clinical and pharmaceutical sciences',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO NOTHING;

  -- Add CS to Islamabad too (many departments exist across campuses)
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'Offering BS, MS, and PhD programs in Computer Science',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO NOTHING;

END $$;

-- ============================================================================
-- INSERT PROGRAMS (Sample programs for key departments)
-- ============================================================================

DO $$
DECLARE
  cs_dept_id UUID;
  se_dept_id UUID;
  ee_dept_id UUID;
  bba_dept_id UUID;
BEGIN
  -- Get department IDs for Lahore campus
  SELECT d.id INTO cs_dept_id FROM departments d
  JOIN campuses c ON d.campus_id = c.id
  WHERE c.code = 'LHR' AND d.code = 'CS' LIMIT 1;
  
  SELECT d.id INTO se_dept_id FROM departments d
  JOIN campuses c ON d.campus_id = c.id
  WHERE c.code = 'LHR' AND d.code = 'SE' LIMIT 1;
  
  SELECT d.id INTO ee_dept_id FROM departments d
  JOIN campuses c ON d.campus_id = c.id
  WHERE c.code = 'LHR' AND d.code = 'EE' LIMIT 1;
  
  SELECT d.id INTO bba_dept_id FROM departments d
  JOIN campuses c ON d.campus_id = c.id
  WHERE c.code = 'LHR' AND d.code = 'BBA' LIMIT 1;  -- Computer Science Programs
  IF cs_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (cs_dept_id, 'BS Computer Science', 'BSCS', 'BS', 4, 133, true),
      (cs_dept_id, 'MS Computer Science', 'MSCS', 'MS', 2, 30, true),
      (cs_dept_id, 'PhD Computer Science', 'PHDCS', 'PhD', 3, 18, true)
    ON CONFLICT (department_id, code) DO NOTHING;
  END IF;

  -- Software Engineering Programs
  IF se_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (se_dept_id, 'BS Software Engineering', 'BSSE', 'BS', 4, 133, true),
      (se_dept_id, 'MS Software Engineering', 'MSSE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO NOTHING;
  END IF;

  -- Electrical Engineering Programs
  IF ee_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (ee_dept_id, 'BS Electrical Engineering', 'BSEE', 'BS', 4, 140, true),
      (ee_dept_id, 'MS Electrical Engineering', 'MSEE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO NOTHING;
  END IF;

  -- Business Administration Programs
  IF bba_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (bba_dept_id, 'BBA (Hons)', 'BBA', 'BBA', 4, 130, true),
      (bba_dept_id, 'MBA', 'MBA', 'MBA', 2, 66, true)
    ON CONFLICT (department_id, code) DO NOTHING;
  END IF;

END $$;

-- ============================================================================
-- UPDATE EXISTING DATA TO DEFAULT TO LAHORE CAMPUS
-- ============================================================================

DO $$
DECLARE
  lahore_campus_id UUID;
  cs_dept_id UUID;
BEGIN
  SELECT c.id INTO lahore_campus_id FROM campuses c WHERE c.code = 'LHR';
  SELECT d.id INTO cs_dept_id FROM departments d
  JOIN campuses c ON d.campus_id = c.id
  WHERE c.code = 'LHR' AND d.code = 'CS' LIMIT 1;

  -- Update existing records without campus_id to Lahore campus
  IF lahore_campus_id IS NOT NULL THEN
    BEGIN
      UPDATE faculty SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE past_papers SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE courses SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE community_posts SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE lost_found_items SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE news_events SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE resources SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE guidance_content SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    BEGIN
      UPDATE student_support_resources SET campus_id = lahore_campus_id WHERE campus_id IS NULL;
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    
    -- Update CS department for CS-related content
    IF cs_dept_id IS NOT NULL THEN
      BEGIN
        UPDATE faculty SET department_id = cs_dept_id WHERE department_id IS NULL AND department ILIKE '%computer%';
      EXCEPTION WHEN undefined_table OR undefined_column THEN NULL;
      END;
      
      BEGIN
        UPDATE courses SET department_id = cs_dept_id WHERE department_id IS NULL AND course_code LIKE 'CS%';
      EXCEPTION WHEN undefined_table OR undefined_column THEN NULL;
      END;
      
      BEGIN
        UPDATE past_papers SET department_id = cs_dept_id WHERE department_id IS NULL AND course_code LIKE 'CS%';
      EXCEPTION WHEN undefined_table OR undefined_column THEN NULL;
      END;
    END IF;
  END IF;
END $$;

COMMENT ON TABLE campuses IS 'All COMSATS campuses with Lahore as default';
COMMENT ON TABLE departments IS 'Departments available at each campus';
COMMENT ON TABLE programs IS 'Degree programs offered by each department';
