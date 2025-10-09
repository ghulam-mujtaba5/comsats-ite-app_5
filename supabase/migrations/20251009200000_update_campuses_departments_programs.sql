-- Update COMSATS Campuses, Departments, and Programs with Accurate Information
-- This migration ensures all COMSATS campuses have accurate departments and programs

-- ============================================================================
-- UPDATE CAMPUSES WITH CORRECT INFORMATION
-- ============================================================================
INSERT INTO campuses (name, code, city, full_name, address, phone, email, is_active, is_default, display_order) VALUES
-- Lahore Campus (Default and Main Focus)
('COMSATS Lahore', 'LHR', 'Lahore', 'COMSATS University Islamabad, Lahore Campus', 
 'Defence Road, Off Raiwind Road, Lahore', '+92-42-111-001-007', 'info@cuilahore.edu.pk', true, true, 1),

-- Islamabad Campus
('COMSATS Islamabad', 'ISB', 'Islamabad', 'COMSATS University Islamabad', 
 'Park Road, Chak Shahzad, Islamabad', '+92-51-9247000', 'info@comsats.edu.pk', true, false, 2),

-- Abbottabad Campus
('COMSATS Abbottabad', 'ATK', 'Abbottabad', 'COMSATS University Islamabad, Abbottabad Campus', 
 'University Road, Abbottabad', '+92-992-383591-6', 'info@cuiatd.edu.pk', true, false, 3),

-- Attock Campus
('COMSATS Attock', 'ATK2', 'Attock', 'COMSATS University Islamabad, Attock Campus', 
 'Kamra Road, Attock', '+92-57-9316588', 'info@cuiatk.edu.pk', true, false, 4),

-- Sahiwal Campus
('COMSATS Sahiwal', 'SWL', 'Sahiwal', 'COMSATS University Islamabad, Sahiwal Campus', 
 'Off GT Road, Sahiwal', '+92-40-4300214-6', 'info@cuisahiwal.edu.pk', true, false, 5),

-- Vehari Campus
('COMSATS Vehari', 'VEH', 'Vehari', 'COMSATS University Islamabad, Vehari Campus', 
 'Vehari', '+92-67-3780614', 'info@cuivehari.edu.pk', true, false, 6),

-- Wah Campus
('COMSATS Wah', 'WAH', 'Wah Cantt', 'COMSATS University Islamabad, Wah Campus', 
 'Quaid Avenue, Wah Cantt', '+92-51-9314001-5', 'info@wah.comsats.edu.pk', true, false, 7),

-- Virtual Campus
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
-- UPDATE ALL CAMPUSES WITH THEIR DEPARTMENTS
-- ============================================================================

DO $$
DECLARE
  lahore_campus_id UUID;
  islamabad_campus_id UUID;
  abbottabad_campus_id UUID;
  attock_campus_id UUID;
  sahiwal_campus_id UUID;
  vehari_campus_id UUID;
  wah_campus_id UUID;
  virtual_campus_id UUID;
BEGIN
  -- Get all campus IDs
  SELECT id INTO lahore_campus_id FROM campuses WHERE code = 'LHR';
  SELECT id INTO islamabad_campus_id FROM campuses WHERE code = 'ISB';
  SELECT id INTO abbottabad_campus_id FROM campuses WHERE code = 'ATK';
  SELECT id INTO attock_campus_id FROM campuses WHERE code = 'ATK2';
  SELECT id INTO sahiwal_campus_id FROM campuses WHERE code = 'SWL';
  SELECT id INTO vehari_campus_id FROM campuses WHERE code = 'VEH';
  SELECT id INTO wah_campus_id FROM campuses WHERE code = 'WAH';
  SELECT id INTO virtual_campus_id FROM campuses WHERE code = 'VRT';

  -- ============================================================================
  -- LAHORE CAMPUS DEPARTMENTS
  -- ============================================================================
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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

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
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- ISLAMABAD CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'Offering BS, MS, and PhD programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Electrical and Computer Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Electrical and Computer Engineering', 
    'ECE', 
    'Department of Electrical and Computer Engineering',
    'Integrated programs in Electrical and Computer Engineering',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Business Administration
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Business Administration', 
    'BBA', 
    'Department of Business Administration',
    'BBA and MBA programs with specializations',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Architecture and Design
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Architecture and Design', 
    'ARCH', 
    'Department of Architecture and Design',
    'Architecture and Design programs',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Economics
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Economics', 
    'ECON', 
    'Department of Economics',
    'Economics programs',
    true, 
    5
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Humanities
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Humanities', 
    'HUM', 
    'Department of Humanities',
    'Humanities programs',
    true, 
    6
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Management Sciences
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Management Sciences', 
    'MGT', 
    'Department of Management Sciences',
    'Management Sciences programs',
    true, 
    7
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Pharmacy
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    islamabad_campus_id, 
    'Pharmacy', 
    'PHARM', 
    'Department of Pharmacy',
    'PharmD program with clinical and pharmaceutical sciences',
    true, 
    8
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- ABBOTTABAD CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'BS, MS, and PhD programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Electrical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Electrical Engineering', 
    'EE', 
    'Department of Electrical Engineering',
    'Electrical Engineering programs',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Civil Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Civil Engineering', 
    'CE', 
    'Department of Civil Engineering',
    'Civil Engineering programs',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Biotechnology
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Biotechnology', 
    'BT', 
    'Department of Biotechnology',
    'Biotechnology programs',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Chemistry
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Chemistry', 
    'CHEM', 
    'Department of Chemistry',
    'Chemistry programs',
    true, 
    5
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Mathematics
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Mathematics', 
    'MATH', 
    'Department of Mathematics',
    'Mathematics programs',
    true, 
    6
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Management Sciences
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    abbottabad_campus_id, 
    'Management Sciences', 
    'MGT', 
    'Department of Management Sciences',
    'Management Sciences programs',
    true, 
    7
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- ATTOCK CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    attock_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'BS, MS programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Electrical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    attock_campus_id, 
    'Electrical Engineering', 
    'EE', 
    'Department of Electrical Engineering',
    'Electrical Engineering programs',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Management Sciences
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    attock_campus_id, 
    'Management Sciences', 
    'MGT', 
    'Department of Management Sciences',
    'Management Sciences programs',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Mathematics
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    attock_campus_id, 
    'Mathematics', 
    'MATH', 
    'Department of Mathematics',
    'Mathematics programs',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- SAHIWAL CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    sahiwal_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'BS, MS programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Electrical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    sahiwal_campus_id, 
    'Electrical Engineering', 
    'EE', 
    'Department of Electrical Engineering',
    'Electrical Engineering programs',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Mechanical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    sahiwal_campus_id, 
    'Mechanical Engineering', 
    'ME', 
    'Department of Mechanical Engineering',
    'Mechanical Engineering programs',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Computer Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    sahiwal_campus_id, 
    'Computer Engineering', 
    'CPE', 
    'Department of Computer Engineering',
    'Computer Engineering programs',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- VEHARI CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    vehari_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'BS programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Management Sciences
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    vehari_campus_id, 
    'Management Sciences', 
    'MGT', 
    'Department of Management Sciences',
    'Management Sciences programs',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Environmental Sciences
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    vehari_campus_id, 
    'Environmental Sciences', 
    'ENV', 
    'Department of Environmental Sciences',
    'Environmental Sciences programs',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Humanities
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    vehari_campus_id, 
    'Humanities', 
    'HUM', 
    'Department of Humanities',
    'Humanities programs',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- WAH CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    wah_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'BS, MS, PhD programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Electrical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    wah_campus_id, 
    'Electrical Engineering', 
    'EE', 
    'Department of Electrical Engineering',
    'Electrical Engineering programs',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Computer Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    wah_campus_id, 
    'Computer Engineering', 
    'CPE', 
    'Department of Computer Engineering',
    'Computer Engineering programs',
    true, 
    3
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Mechanical Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    wah_campus_id, 
    'Mechanical Engineering', 
    'ME', 
    'Department of Mechanical Engineering',
    'Mechanical Engineering programs',
    true, 
    4
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Civil Engineering
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    wah_campus_id, 
    'Civil Engineering', 
    'CE', 
    'Department of Civil Engineering',
    'Civil Engineering programs',
    true, 
    5
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Mathematics
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    wah_campus_id, 
    'Mathematics', 
    'MATH', 
    'Department of Mathematics',
    'Mathematics programs',
    true, 
    6
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- ============================================================================
  -- VIRTUAL CAMPUS DEPARTMENTS
  -- ============================================================================
  -- Computer Science
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    virtual_campus_id, 
    'Computer Science', 
    'CS', 
    'Department of Computer Science',
    'Online BS, MS programs in Computer Science',
    true, 
    1
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

  -- Management Sciences
  INSERT INTO departments (campus_id, name, code, full_name, description, is_active, display_order)
  VALUES (
    virtual_campus_id, 
    'Management Sciences', 
    'MGT', 
    'Department of Management Sciences',
    'Online Management Sciences programs',
    true, 
    2
  ) ON CONFLICT (campus_id, code) DO UPDATE SET
    name = EXCLUDED.name,
    full_name = EXCLUDED.full_name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

END $$;

-- ============================================================================
-- INSERT PROGRAMS FOR KEY DEPARTMENTS
-- ============================================================================

DO $$
DECLARE
  cs_dept_id UUID;
  se_dept_id UUID;
  ee_dept_id UUID;
  bba_dept_id UUID;
  math_dept_id UUID;
  phy_dept_id UUID;
  chem_dept_id UUID;
  arch_dept_id UUID;
  econ_dept_id UUID;
  hum_dept_id UUID;
  mgt_dept_id UUID;
  pharm_dept_id UUID;
  ece_dept_id UUID;
  ele_dept_id UUID;
  te_dept_id UUID;
  bt_dept_id UUID;
  ce_dept_id UUID;
  me_dept_id UUID;
  cpe_dept_id UUID;
  env_dept_id UUID;
BEGIN
  -- Get department IDs for all campuses
  SELECT d.id INTO cs_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'CS' LIMIT 1;
  SELECT d.id INTO se_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'SE' LIMIT 1;
  SELECT d.id INTO ee_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'EE' LIMIT 1;
  SELECT d.id INTO bba_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'BBA' LIMIT 1;
  SELECT d.id INTO math_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'MATH' LIMIT 1;
  SELECT d.id INTO phy_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'PHY' LIMIT 1;
  SELECT d.id INTO chem_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'CHEM' LIMIT 1;
  SELECT d.id INTO ele_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'ELE' LIMIT 1;
  SELECT d.id INTO te_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'LHR' AND d.code = 'TE' LIMIT 1;
  
  -- Islamabad campus departments
  SELECT d.id INTO ece_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ISB' AND d.code = 'ECE' LIMIT 1;
  SELECT d.id INTO arch_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ISB' AND d.code = 'ARCH' LIMIT 1;
  SELECT d.id INTO econ_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ISB' AND d.code = 'ECON' LIMIT 1;
  SELECT d.id INTO hum_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ISB' AND d.code = 'HUM' LIMIT 1;
  SELECT d.id INTO mgt_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ISB' AND d.code = 'MGT' LIMIT 1;
  SELECT d.id INTO pharm_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ISB' AND d.code = 'PHARM' LIMIT 1;
  
  -- Abbottabad campus departments
  SELECT d.id INTO bt_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ATK' AND d.code = 'BT' LIMIT 1;
  SELECT d.id INTO ce_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'ATK' AND d.code = 'CE' LIMIT 1;
  
  -- Wah campus departments
  SELECT d.id INTO me_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'WAH' AND d.code = 'ME' LIMIT 1;
  SELECT d.id INTO cpe_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'WAH' AND d.code = 'CPE' LIMIT 1;
  
  -- Vehari campus departments
  SELECT d.id INTO env_dept_id FROM departments d JOIN campuses c ON d.campus_id = c.id WHERE c.code = 'VEH' AND d.code = 'ENV' LIMIT 1;

  -- ============================================================================
  -- PROGRAMS FOR LAHORE CAMPUS
  -- ============================================================================
  -- Computer Science Programs
  IF cs_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (cs_dept_id, 'BS Computer Science', 'BSCS', 'BS', 4, 133, true),
      (cs_dept_id, 'MS Computer Science', 'MSCS', 'MS', 2, 30, true),
      (cs_dept_id, 'PhD Computer Science', 'PHDCS', 'PhD', 3, 18, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Software Engineering Programs
  IF se_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (se_dept_id, 'BS Software Engineering', 'BSSE', 'BS', 4, 133, true),
      (se_dept_id, 'MS Software Engineering', 'MSSE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Electrical Engineering Programs
  IF ee_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (ee_dept_id, 'BS Electrical Engineering', 'BSEE', 'BS', 4, 140, true),
      (ee_dept_id, 'MS Electrical Engineering', 'MSEE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Business Administration Programs
  IF bba_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (bba_dept_id, 'BBA (Hons)', 'BBA', 'BBA', 4, 130, true),
      (bba_dept_id, 'MBA', 'MBA', 'MBA', 2, 66, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Mathematics Programs
  IF math_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (math_dept_id, 'BS Mathematics', 'BSMATH', 'BS', 4, 130, true),
      (math_dept_id, 'MS Mathematics', 'MSMATH', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Physics Programs
  IF phy_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (phy_dept_id, 'BS Physics', 'BSPHY', 'BS', 4, 130, true),
      (phy_dept_id, 'MS Physics', 'MSPHY', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Chemistry Programs
  IF chem_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (chem_dept_id, 'BS Chemistry', 'BSCHEM', 'BS', 4, 130, true),
      (chem_dept_id, 'MS Chemistry', 'MSCHEM', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Electronics Engineering Programs
  IF ele_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (ele_dept_id, 'BS Electronics Engineering', 'BSELE', 'BS', 4, 135, true),
      (ele_dept_id, 'MS Electronics Engineering', 'MSELE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Telecom Engineering Programs
  IF te_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (te_dept_id, 'BS Telecom Engineering', 'BSTE', 'BS', 4, 135, true),
      (te_dept_id, 'MS Telecom Engineering', 'MSTE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- ============================================================================
  -- PROGRAMS FOR ISLAMABAD CAMPUS
  -- ============================================================================
  -- Electrical and Computer Engineering Programs
  IF ece_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (ece_dept_id, 'BS Electrical and Computer Engineering', 'BSECE', 'BS', 4, 140, true),
      (ece_dept_id, 'MS Electrical and Computer Engineering', 'MSECE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Architecture Programs
  IF arch_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (arch_dept_id, 'BS Architecture', 'BSARCH', 'BS', 5, 160, true),
      (arch_dept_id, 'MS Architecture', 'MSARCH', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Economics Programs
  IF econ_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (econ_dept_id, 'BS Economics', 'BSECON', 'BS', 4, 130, true),
      (econ_dept_id, 'MS Economics', 'MSECON', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Pharmacy Programs
  IF pharm_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (pharm_dept_id, 'Doctor of Pharmacy', 'PHARMD', 'PharmD', 5, 170, true),
      (pharm_dept_id, 'MS Pharmacy', 'MSPHARM', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- ============================================================================
  -- PROGRAMS FOR ABBOTTABAD CAMPUS
  -- ============================================================================
  -- Biotechnology Programs
  IF bt_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (bt_dept_id, 'BS Biotechnology', 'BSBT', 'BS', 4, 130, true),
      (bt_dept_id, 'MS Biotechnology', 'MSBT', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Civil Engineering Programs
  IF ce_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (ce_dept_id, 'BS Civil Engineering', 'BSCE', 'BS', 4, 140, true),
      (ce_dept_id, 'MS Civil Engineering', 'MSCE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- ============================================================================
  -- PROGRAMS FOR WAH CAMPUS
  -- ============================================================================
  -- Mechanical Engineering Programs
  IF me_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (me_dept_id, 'BS Mechanical Engineering', 'BSME', 'BS', 4, 140, true),
      (me_dept_id, 'MS Mechanical Engineering', 'MSME', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- Computer Engineering Programs
  IF cpe_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (cpe_dept_id, 'BS Computer Engineering', 'BSCPE', 'BS', 4, 135, true),
      (cpe_dept_id, 'MS Computer Engineering', 'MSCPE', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
  END IF;

  -- ============================================================================
  -- PROGRAMS FOR VEHARI CAMPUS
  -- ============================================================================
  -- Environmental Sciences Programs
  IF env_dept_id IS NOT NULL THEN
    INSERT INTO programs (department_id, name, code, degree_type, duration_years, total_credit_hours, is_active)
    VALUES 
      (env_dept_id, 'BS Environmental Sciences', 'BSENV', 'BS', 4, 130, true),
      (env_dept_id, 'MS Environmental Sciences', 'MSENV', 'MS', 2, 30, true)
    ON CONFLICT (department_id, code) DO UPDATE SET
      name = EXCLUDED.name,
      degree_type = EXCLUDED.degree_type,
      duration_years = EXCLUDED.duration_years,
      total_credit_hours = EXCLUDED.total_credit_hours,
      is_active = EXCLUDED.is_active;
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

-- Verification queries
-- Check campuses
SELECT 'Campuses' as table_name, COUNT(*) as count FROM campuses WHERE is_active = true;
-- Check departments
SELECT 'Departments' as table_name, COUNT(*) as count FROM departments WHERE is_active = true;
-- Check programs
SELECT 'Programs' as table_name, COUNT(*) as count FROM programs WHERE is_active = true;

COMMENT ON TABLE campuses IS 'All COMSATS campuses with accurate information';
COMMENT ON TABLE departments IS 'Academic departments within each campus';
COMMENT ON TABLE programs IS 'Degree programs offered by departments';