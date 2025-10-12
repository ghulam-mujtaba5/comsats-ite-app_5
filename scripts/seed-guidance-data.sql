-- Seed data for guidance_content table
INSERT INTO public.guidance_content (title, description, content, category, is_important, is_published)
VALUES
  ('Course Registration Process', 'Step-by-step guide for registering courses each semester', '**Course Registration Steps:**

1. **Pre-Registration Phase**
   - Check your academic standing
   - Meet with your academic advisor
   - Plan your course schedule

2. **Registration Period**
   - Log into the student portal
   - Select courses based on your degree plan
   - Ensure prerequisites are met
   - Submit your registration

3. **Post-Registration**
   - Pay semester fees
   - Verify your schedule
   - Make any necessary changes during add/drop period

**Important Dates:**
- Early Registration: 2 weeks before semester
- Regular Registration: 1 week before semester
- Add/Drop Period: First week of semester', 'academic', true, true),

  ('Campus Facilities Guide', 'Information about campus facilities and services', '**Campus Locations:**

**Main Campus:**
- Academic Offices:
  - CS: Computer Science Department
  - EE: Electrical Engineering Department
  - Management: Business Administration Department

**Student Services:**
- Library: Main building, extended hours during exams
- Cafeteria: Multiple dining options
- Sports Complex: Gym, courts, and fields
- Medical Center: First aid and health services

**Administrative Offices:**
- Registrar''s Office: Transcripts, certificates
- Finance Office: Fee payments, scholarships
- Student Affairs Office: Clubs, events
- Transportation: University buses available from major city points
- Parking: Available for students and faculty', 'campus', false, true),

  ('Financial Aid Information', 'Scholarships, grants, and financial assistance programs', '**Financial Aid Programs:**

**Available Programs:**

**Merit-Based Scholarships:**
- Academic Excellence: 50% fee waiver for top performers
- Dean''s List: 25% fee waiver for consistent high achievers

**Need-Based Financial Aid:**
- Financial Assistance Program: Up to 75% fee waiver
- Emergency Financial Support: Short-term assistance

**Application Process:**
1. Submit financial aid application
2. Provide required documentation
3. Attend interview if selected
4. Await decision notification

**Required Documents:**
- Income certificate
- Academic transcripts
- Bank statements
- Recommendation letters

**Deadlines:**
- Fall Semester: June 30th
- Spring Semester: December 31st', 'financial', true, true),

  ('Academic Policies', 'Important academic policies every student should know', '**Academic Policies:**

**Attendance Policy:**
- Minimum 75% attendance required
- Medical leave requires documentation
- Excessive absences may result in course failure

**Grading System:**
- A: 85-100 (4.0 GPA)
- B: 70-84 (3.0 GPA)
- C: 60-69 (2.0 GPA)
- D: 50-59 (1.0 GPA)
- F: Below 50 (0.0 GPA)

**Academic Probation:**
- CGPA below 2.0 results in probation
- Two consecutive semesters of probation may lead to dismissal

**Grade Appeals:**
- Must be filed within 2 weeks of grade posting
- Requires written justification
- Reviewed by academic committee

**Academic Integrity:**
- Zero tolerance for academic dishonesty
- Penalties range from assignment failure to course failure
- Repeat offenses may result in dismissal', 'policies', true, true),

  ('Admission Requirements', 'Entry requirements and admission process', '**Undergraduate Admission Requirements:**

**Entry Tests:**
- ECAT/SAT for Engineering programs
- NAT for non-engineering programs
- Minimum score requirements vary by program

**Academic Requirements:**
- Intermediate/A-Levels with minimum percentage
- Relevant subjects for chosen program

**Application Process:**
1. Online application submission
2. Fee payment
3. Document verification
4. Entry test
5. Merit list publication
6. Admission confirmation

**Important Documents:**
- Matric/O-Level certificates
- Intermediate/A-Level certificates
- CNIC/B-Form
- Recent photographs
- Fee challan', 'admission', true, true),

  ('Library Resources', 'How to access and use library resources', '**Library Services:**

**Physical Resources:**
- Extensive collection of books and journals
- Study spaces and reading rooms
- Computer labs with internet access

**Digital Resources:**
- Online databases and e-journals
- E-books and digital library
- Remote access for students

**Services:**
- Book borrowing and returns
- Reference assistance
- Research consultation
- Document delivery
- Inter-library loans

**Library Hours:**
- Regular Semester: Open 24/7
- Exam Period: Extended hours
- Holidays: Reduced hours

**How to Access:**
- Use student ID card
- Register for digital library access
- Follow library rules and regulations', 'campus', false, true);

-- Seed data for faq_items table
INSERT INTO public.faq_items (question, answer, category, tags, is_published)
VALUES
  ('How do I register for courses?', 'Course registration is done through the student portal during designated registration periods. Make sure to meet with your advisor first to plan your semester schedule. Log in to CU Online portal, select your courses based on your degree plan, ensure prerequisites are met, and submit your registration. Remember to pay your fees before the deadline to confirm your registration.', 'academic', ARRAY['registration', 'courses', 'portal'], true),
  
  ('What are the library hours?', 'The library is open 24/7 during regular semester periods. During breaks and holidays, hours may be reduced. Check the library website or contact the library staff for current hours. The library offers extended hours during exam periods to accommodate students.', 'campus', ARRAY['library', 'hours', 'facilities'], true),
  
  ('How can I apply for financial aid?', 'Financial aid applications are available through the student portal. Submit your application along with required documents (income certificate, bank statements, academic transcripts, recommendation letters) before the deadline. Fall semester deadline is June 30th, and Spring semester deadline is December 31st. After submission, you may be called for an interview.', 'financial', ARRAY['financial aid', 'scholarships', 'application'], true),
  
  ('What is the minimum CGPA requirement?', 'Students must maintain a minimum CGPA of 2.0 to remain in good academic standing. A CGPA below 2.0 may result in academic probation. Two consecutive semesters of probation may lead to dismissal from the program. It''s important to monitor your grades and seek academic support if needed.', 'academic', ARRAY['cgpa', 'grades', 'requirements'], true),
  
  ('How do I join student clubs?', 'Contact the Student Affairs office or visit club booths during orientation week. Most clubs have open membership and welcome new students throughout the year. Check the student portal or campus notice boards for club information, meeting schedules, and upcoming events. Joining clubs is a great way to meet new people and develop new skills.', 'campus', ARRAY['clubs', 'activities', 'student life'], true),
  
  ('What is the attendance policy?', 'Students are required to maintain a minimum of 75% attendance in all courses. Attendance below this threshold may result in course failure or other academic penalties. Medical leave requires proper documentation from a registered medical practitioner. Contact your instructor if you have attendance concerns.', 'academic', ARRAY['attendance', 'policy', 'requirements'], true),
  
  ('How do I access my student email?', 'Your student email can be accessed through Microsoft Outlook at outlook.office.com. Use your student ID and password to log in. Your email address follows the format: studentid@cuilahore.edu.pk. This is your official communication channel with the university, so check it regularly.', 'campus', ARRAY['email', 'technology', 'account'], true),
  
  ('What transportation options are available?', 'The university provides bus services from various locations in the city. Route information and schedules are available on the student portal. You can also use your own vehicle - parking is available for students and faculty. Contact the Transportation Office for route details and bus passes.', 'campus', ARRAY['transportation', 'buses', 'parking'], true),
  
  ('How do I change my major?', 'To change your major, you need to meet with your academic advisor to discuss your options. Then submit a formal request through the Academic Office. Changes may be subject to availability and meeting minimum GPA requirements for the new program. This process typically takes 2-4 weeks.', 'academic', ARRAY['major', 'program', 'change'], true),
  
  ('What health services are available on campus?', 'The campus has a medical center that provides first aid, basic healthcare services, and health consultations. The medical center is staffed during regular hours. For emergencies, contact campus security or call emergency services. Health insurance information is available through the Student Affairs office.', 'campus', ARRAY['health', 'medical', 'services'], true);
