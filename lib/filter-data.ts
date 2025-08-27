import { GraduationCap, Cpu, Zap, Building, Globe, FlaskConical, Calculator, Palette } from "lucide-react"

// Centralized department structure with hierarchical organization
export interface Department {
  id: string
  name: string
  shortName: string
  description: string
  icon?: any
  color: string
  faculty: string
  courses?: string[]
  specializations?: string[]
}

export interface Faculty {
  id: string
  name: string
  description: string
  departments: string[]
}

// COMSATS University faculties and departments
export const faculties: Faculty[] = [
  {
    id: 'engineering',
    name: 'Faculty of Engineering',
    description: 'Engineering and Technology disciplines',
    departments: ['computer-science', 'software-engineering', 'electrical-engineering', 'telecom-engineering']
  },
  {
    id: 'business',
    name: 'Faculty of Business',
    description: 'Business and Management studies',
    departments: ['business-administration', 'management-sciences']
  },
  {
    id: 'sciences',
    name: 'Faculty of Sciences',
    description: 'Pure and Applied Sciences',
    departments: ['mathematics', 'physics', 'chemistry']
  }
]

export const departments: Department[] = [
  {
    id: 'computer-science',
    name: 'Computer Science',
    shortName: 'CS',
    description: 'Computing, algorithms, and software development',
    icon: Cpu,
    color: 'blue',
    faculty: 'engineering',
    specializations: ['Artificial Intelligence', 'Data Science', 'Cyber Security', 'Software Engineering']
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    shortName: 'SE',
    description: 'Software development methodologies and practices',
    icon: Cpu,
    color: 'indigo',
    faculty: 'engineering',
    specializations: ['Web Development', 'Mobile App Development', 'DevOps', 'Quality Assurance']
  },
  {
    id: 'electrical-engineering',
    name: 'Electrical Engineering',
    shortName: 'EE',
    description: 'Electrical systems and power engineering',
    icon: Zap,
    color: 'yellow',
    faculty: 'engineering',
    specializations: ['Power Systems', 'Control Systems', 'Electronics', 'Renewable Energy']
  },
  {
    id: 'telecom-engineering',
    name: 'Telecommunication Engineering',
    shortName: 'TE',
    description: 'Communication systems and networks',
    icon: Globe,
    color: 'green',
    faculty: 'engineering',
    specializations: ['Network Engineering', 'Wireless Communication', 'Signal Processing', '5G Technology']
  },
  {
    id: 'business-administration',
    name: 'Business Administration',
    shortName: 'BBA',
    description: 'Business management and administration',
    icon: Building,
    color: 'purple',
    faculty: 'business',
    specializations: ['Marketing', 'Finance', 'Human Resources', 'Operations Management']
  },
  {
    id: 'management-sciences',
    name: 'Management Sciences',
    shortName: 'MS',
    description: 'Advanced management and leadership',
    icon: GraduationCap,
    color: 'pink',
    faculty: 'business',
    specializations: ['Strategic Management', 'Project Management', 'Supply Chain', 'Business Analytics']
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    shortName: 'MATH',
    description: 'Pure and applied mathematics',
    icon: Calculator,
    color: 'red',
    faculty: 'sciences',
    specializations: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Actuarial Science']
  },
  {
    id: 'physics',
    name: 'Physics',
    shortName: 'PHY',
    description: 'Physical sciences and research',
    icon: FlaskConical,
    color: 'teal',
    faculty: 'sciences',
    specializations: ['Theoretical Physics', 'Applied Physics', 'Quantum Physics', 'Astrophysics']
  }
]

// Common filter configurations for different content types
export interface FilterConfig {
  id: string
  label: string
  placeholder: string
  description?: string
  options: Array<{
    label: string
    value: string
    description?: string
  }>
}

// Standard filter configurations
export const standardFilters = {
  departments: {
    id: 'department',
    label: 'Department',
    placeholder: 'All Departments',
    description: 'Filter by academic department',
    options: [
      { label: 'All Departments', value: 'All' },
      ...departments.map(dept => ({
        label: dept.name,
        value: dept.name,
        description: dept.description
      }))
    ]
  },

  faculties: {
    id: 'faculty',
    label: 'Faculty',
    placeholder: 'All Faculties',
    description: 'Filter by faculty',
    options: [
      { label: 'All Faculties', value: 'All' },
      ...faculties.map(faculty => ({
        label: faculty.name,
        value: faculty.id,
        description: faculty.description
      }))
    ]
  },

  examTypes: {
    id: 'examType',
    label: 'Exam Type',
    placeholder: 'All Types',
    description: 'Filter by examination type',
    options: [
      { label: 'All Types', value: 'All' },
      { label: 'Mid-Term', value: 'Mid-Term', description: 'Mid-semester examinations' },
      { label: 'Final', value: 'Final', description: 'Final examinations' },
      { label: 'Quiz', value: 'Quiz', description: 'Short quizzes and tests' },
      { label: 'Assignment', value: 'Assignment', description: 'Take-home assignments' },
      { label: 'Project', value: 'Project', description: 'Course projects' }
    ]
  },

  semesters: {
    id: 'semester',
    label: 'Semester',
    placeholder: 'All Semesters',
    description: 'Filter by academic semester',
    options: [
      { label: 'All Semesters', value: 'All' },
      { label: 'Fall 2024', value: 'Fall 2024' },
      { label: 'Spring 2024', value: 'Spring 2024' },
      { label: 'Fall 2023', value: 'Fall 2023' },
      { label: 'Spring 2023', value: 'Spring 2023' },
      { label: 'Fall 2022', value: 'Fall 2022' },
      { label: 'Spring 2022', value: 'Spring 2022' }
    ]
  },

  academicYears: {
    id: 'year',
    label: 'Year',
    placeholder: 'All Years',
    description: 'Filter by academic year',
    options: [
      { label: 'All Years', value: 'All' },
      ...Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i
        return { label: year.toString(), value: year.toString() }
      })
    ]
  },

  difficulty: {
    id: 'difficulty',
    label: 'Difficulty',
    placeholder: 'All Levels',
    description: 'Filter by difficulty level',
    options: [
      { label: 'All Levels', value: 'All' },
      { label: 'Beginner', value: 'Beginner', description: 'Suitable for beginners' },
      { label: 'Intermediate', value: 'Intermediate', description: 'Moderate difficulty' },
      { label: 'Advanced', value: 'Advanced', description: 'Advanced level content' },
      { label: 'Expert', value: 'Expert', description: 'Expert level material' }
    ]
  },

  resourceTypes: {
    id: 'type',
    label: 'Resource Type',
    placeholder: 'All Types',
    description: 'Filter by resource type',
    options: [
      { label: 'All Types', value: 'All' },
      { label: 'Document', value: 'Document', description: 'Text documents and PDFs' },
      { label: 'Video', value: 'Video', description: 'Video tutorials and lectures' },
      { label: 'Presentation', value: 'Presentation', description: 'Slide presentations' },
      { label: 'Tool', value: 'Tool', description: 'Software tools and utilities' },
      { label: 'Link', value: 'Link', description: 'External web resources' }
    ]
  },

  supportCategories: {
    id: 'category',
    label: 'Category',
    placeholder: 'All Categories',
    description: 'Filter by support category',
    options: [
      { label: 'All Categories', value: 'all' },
      { label: 'Academic Support', value: 'academic', description: 'Study help and tutoring' },
      { label: 'Mental Health', value: 'mental-health', description: 'Counseling and wellness' },
      { label: 'Financial Aid', value: 'financial', description: 'Scholarships and financial help' },
      { label: 'Career Services', value: 'career', description: 'Job placement and career guidance' },
      { label: 'Personal Development', value: 'personal', description: 'Skills and personal growth' },
      { label: 'Technology Support', value: 'technical', description: 'IT and technical assistance' }
    ]
  }
} as const

// Utility functions
export function getDepartmentById(id: string): Department | undefined {
  return departments.find(dept => dept.id === id)
}

export function getDepartmentByName(name: string): Department | undefined {
  return departments.find(dept => dept.name === name)
}

export function getFacultyById(id: string): Faculty | undefined {
  return faculties.find(faculty => faculty.id === id)
}

export function getDepartmentsByFaculty(facultyId: string): Department[] {
  const faculty = getFacultyById(facultyId)
  if (!faculty) return []
  return departments.filter(dept => faculty.departments.includes(dept.id))
}

// Common sort options for different content types
export const sortOptions = {
  pastPapers: [
    { label: 'Most Recent', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Most Downloaded', value: 'downloads-desc' },
    { label: 'Title A-Z', value: 'title-asc' },
    { label: 'Title Z-A', value: 'title-desc' },
    { label: 'Course Code', value: 'course-asc' }
  ],
  resources: [
    { label: 'Most Recent', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Most Popular', value: 'popularity-desc' },
    { label: 'Title A-Z', value: 'title-asc' },
    { label: 'Title Z-A', value: 'title-desc' },
    { label: 'File Size', value: 'size-desc' }
  ],
  faculty: [
    { label: 'Name A-Z', value: 'name-asc' },
    { label: 'Name Z-A', value: 'name-desc' },
    { label: 'Highest Rated', value: 'rating-desc' },
    { label: 'Most Reviews', value: 'reviews-desc' },
    { label: 'Department', value: 'department-asc' },
    { label: 'Experience', value: 'experience-desc' }
  ],
  general: [
    { label: 'Most Relevant', value: 'relevance-desc' },
    { label: 'Most Recent', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Title A-Z', value: 'title-asc' },
    { label: 'Title Z-A', value: 'title-desc' }
  ]
}

// Filter preset templates
export const filterPresets = {
  pastPapers: [
    {
      id: 'recent-cs',
      name: 'Recent CS Papers',
      filters: { department: 'Computer Science', semester: 'Fall 2024' },
      description: 'Latest Computer Science papers'
    },
    {
      id: 'midterms-all',
      name: 'All Midterms',
      filters: { examType: 'Mid-Term' },
      description: 'Mid-term examinations only'
    },
    {
      id: 'programming-papers',
      name: 'Programming Papers',
      filters: { search: 'programming', department: 'Computer Science' },
      description: 'Programming related papers'
    }
  ],
  resources: [
    {
      id: 'verified-docs',
      name: 'Verified Documents',
      filters: { type: 'Document', verified: 'true' },
      description: 'Verified document resources'
    },
    {
      id: 'beginner-videos',
      name: 'Beginner Videos',
      filters: { type: 'Video', difficulty: 'Beginner' },
      description: 'Video tutorials for beginners'
    }
  ]
}