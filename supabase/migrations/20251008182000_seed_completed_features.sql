-- Seed data for completed features

-- Student Portal Resources
INSERT INTO student_portal_resources (title, description, url, category, icon_name, requires_vpn, is_external, sort_order, status) VALUES
('CU Online Portal', 'Access your student account, registration, fee challans, and academic records', 'https://cuonline.cuilahore.edu.pk', 'cuonline', 'Globe', false, true, 1, 'active'),
('Student Email', 'Access your official COMSATS student email account', 'https://outlook.office.com', 'email', 'Mail', false, true, 2, 'active'),
('Moodle LMS', 'Learning Management System for course materials, assignments, and quizzes', 'https://lms.cuilahore.edu.pk', 'lms', 'BookOpen', false, true, 3, 'active'),
('Digital Library', 'Access e-books, research papers, journals and academic resources', 'https://library.cuilahore.edu.pk', 'library', 'Library', true, true, 4, 'active'),
('Exam Schedule', 'View exam timetables and important academic dates', 'https://cuonline.cuilahore.edu.pk/examschedule', 'cuonline', 'Calendar', false, true, 5, 'active'),
('Fee Payment', 'Download fee challans and check payment status', 'https://cuonline.cuilahore.edu.pk/finance', 'cuonline', 'FileText', false, true, 6, 'active'),
('Academic Calendar', 'View semester dates, holidays, and important deadlines', 'https://cuilahore.edu.pk/academic-calendar', 'other', 'Calendar', false, true, 7, 'active'),
('Student Helpline', 'Contact student services for assistance', 'tel:+92-42-111-001-007', 'other', 'HelpCircle', false, true, 8, 'active')
ON CONFLICT DO NOTHING;

-- Guidance Content
INSERT INTO guidance_content (title, description, content, category, is_important, is_published) VALUES
('How to Register for Courses', 'Step-by-step guide for course registration', E'# Course Registration Guide\n\n## Step 1: Check Prerequisites\n- Verify you have completed all prerequisite courses\n- Check your CGPA requirements\n\n## Step 2: Plan Your Semester\n- Review course offerings\n- Check class timings\n- Ensure no schedule conflicts\n\n## Step 3: Register Online\n1. Login to CU Online\n2. Go to Course Registration\n3. Select courses from available list\n4. Submit registration\n\n## Important Notes\n- Registration opens 1 week before semester\n- Late registration incurs penalty\n- Maximum 18 credit hours per semester', 'academic', true, true),
('How to Apply for Leave', 'Process for requesting academic leave', E'# Leave Application Guide\n\n## Types of Leave\n- Medical Leave\n- Emergency Leave\n- Academic Leave\n\n## Application Process\n1. Download leave application form\n2. Get it signed by advisor\n3. Submit to Student Affairs\n4. Wait for approval (3-5 days)\n\n## Required Documents\n- Medical certificate (for medical leave)\n- Parent/Guardian letter\n- Valid reason statement', 'academic', false, true),
('Internship Guidelines', 'How to find and complete internship requirements', E'# Internship Guide\n\n## Finding an Internship\n- Check university job board\n- Network with alumni\n- Apply through company websites\n- Attend career fairs\n\n## Requirements\n- Minimum 6-8 weeks\n- Relevant to your field\n- Approved by department\n\n## Submission\n- Internship report\n- Company certificate\n- Supervisor evaluation\n- Presentation (if required)', 'career', true, true),
('How to Check Results', 'Access and understand your academic results', E'# Results Guide\n\n## Checking Results\n1. Login to CU Online\n2. Navigate to Results section\n3. Select semester\n4. View detailed marks\n\n## Understanding Grades\n- A: 86-100%\n- B: 71-85%\n- C: 61-70%\n- D: 50-60%\n- F: Below 50%\n\n## Grade Points\n- A = 4.0\n- B = 3.0\n- C = 2.0\n- D = 1.0\n- F = 0.0', 'academic', true, true)
ON CONFLICT DO NOTHING;

-- FAQ Items
INSERT INTO faq_items (question, answer, category, tags) VALUES
('How do I reset my CU Online password?', 'Visit the CU Online portal, click "Forgot Password", enter your registration number, and follow the email instructions.', 'technical', ARRAY['password', 'cuonline', 'login']),
('What is the late fee for course registration?', 'Late registration incurs a fee of Rs. 500 per day after the deadline, with a maximum of Rs. 5000.', 'finance', ARRAY['fees', 'registration', 'deadline']),
('How many credit hours can I take per semester?', 'Normal load is 15-18 credit hours. You need special permission for overload (more than 18 hours).', 'academic', ARRAY['registration', 'credits', 'semester']),
('Where can I get my fee challan?', 'Login to CU Online, go to Finance section, and download your current semester fee challan.', 'finance', ARRAY['fees', 'challan', 'payment']),
('How do I apply for a transcript?', 'Visit the Exam Office, fill the transcript request form, pay the fee, and collect after 3-5 working days.', 'academic', ARRAY['transcript', 'documents', 'exams'])
ON CONFLICT DO NOTHING;

-- Student Support Resources  
INSERT INTO student_support_resources (title, description, category, priority, contact_info, tags, is_active) VALUES
('Academic Advising', 'Get help with course selection, academic planning, and degree requirements', 'academic', 'medium', 'advising@cuilahore.edu.pk', ARRAY['advising', 'courses', 'planning'], true),
('Mental Health Counseling', 'Confidential counseling services for stress, anxiety, and personal issues', 'mental-health', 'high', 'counseling@cuilahore.edu.pk', ARRAY['mental health', 'counseling', 'wellness'], true),
('Career Counseling', 'Career guidance, resume building, and interview preparation', 'career', 'medium', 'careers@cuilahore.edu.pk', ARRAY['career', 'jobs', 'internships'], true),
('Financial Aid Office', 'Information about scholarships, financial aid, and payment plans', 'financial', 'high', 'finaid@cuilahore.edu.pk', ARRAY['scholarships', 'financial aid', 'fees'], true),
('IT Helpdesk', 'Technical support for email, LMS, and other university systems', 'technical', 'medium', 'ithelpdesk@cuilahore.edu.pk', ARRAY['technical', 'email', 'lms'], true)
ON CONFLICT DO NOTHING;

-- Database functions for comment counts
CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts 
  SET comments_count = COALESCE(comments_count, 0) + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_comment_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts 
  SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION increment_comment_count IS 'Increment comment count for a post';
COMMENT ON FUNCTION decrement_comment_count IS 'Decrement comment count for a post';
