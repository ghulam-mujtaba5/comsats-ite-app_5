/**
 * 🎯 Centralized SEO Configuration for Maximum Google Rankings
 * 
 * This file contains all SEO settings optimized for:
 * - COMSATS GPA calculator (primary keyword)
 * - COMSATS past papers
 * - COMSATS faculty reviews
 * - Local search (Lahore)
 */

export const siteConfig = {
  name: "CampusAxis",
  title: "CampusAxis - COMSATS University Academic Portal | GPA Calculator, Past Papers & Faculty Reviews",
  description: "Official academic portal for COMSATS University Lahore students. Free GPA calculator, past papers, faculty reviews, timetables, and study resources. Join 10,000+ COMSATS students!",
  url: "https://campusaxis.site",
  ogImage: "https://campusaxis.site/og-preview.png",
  keywords: [
    // Primary Keywords
    "COMSATS GPA calculator",
    "COMSATS past papers",
    "COMSATS faculty reviews",
    "COMSATS University Lahore",
    "COMSATS academic portal",
    
    // Secondary Keywords
    "COMSATS CGPA calculator",
    "COMSATS timetable",
    "COMSATS resources",
    "COMSATS student portal",
    "COMSATS study material",
    
    // Long-tail Keywords
    "COMSATS GPA calculator online free",
    "download COMSATS past papers",
    "COMSATS professor reviews",
    "COMSATS semester resources",
    "COMSATS exam papers PDF",
  ],
  author: {
    name: "CampusAxis Team",
    url: "https://campusaxis.site/about",
  },
  creator: "CampusAxis",
  publisher: "CampusAxis",
  locale: "en_PK",
  alternateLocale: "ur_PK",
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "CampusAxis",
  "alternateName": "CampusAxis - COMSATS Academic Portal",
  "url": "https://campusaxis.site",
  "logo": "https://campusaxis.site/Campus Axis 1.svg",
  "description": siteConfig.description,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lahore",
    "addressRegion": "Punjab",
    "addressCountry": "PK"
  },
  "sameAs": [
    // Add your social media profiles here
    "https://facebook.com/campusaxis",
    "https://twitter.com/campusaxis",
    "https://linkedin.com/company/campusaxis",
  ],
  "areaServed": {
    "@type": "Place",
    "name": "Pakistan"
  }
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": siteConfig.name,
  "url": siteConfig.url,
  "description": siteConfig.description,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://campusaxis.site/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

// Page-specific SEO templates
export const pageTemplates = {
  gpaCalculator: {
    title: "COMSATS GPA Calculator - Free Online CGPA Calculator 2025",
    description: "Calculate your COMSATS GPA/CGPA instantly with our free online calculator. Supports latest grading scale, semester-wise calculation, and credit hours. Accurate results for COMSATS students.",
    keywords: "COMSATS GPA calculator, COMSATS CGPA calculator, GPA calculation COMSATS, online GPA calculator, COMSATS grading scale",
    canonical: "/gpa-calculator",
  },
  
  pastPapers: {
    title: "COMSATS Past Papers - Download Previous Exam Papers Free",
    description: "Access and download COMSATS University past exam papers for all departments and semesters. Free PDF downloads of previous year question papers to ace your exams.",
    keywords: "COMSATS past papers, COMSATS exam papers, previous papers COMSATS, question papers download, COMSATS PDF papers",
    canonical: "/past-papers",
  },
  
  faculty: {
    title: "COMSATS Faculty Reviews - Professor Ratings & Reviews by Students",
    description: "Read honest student reviews and ratings of COMSATS University professors. Find the best teachers, course difficulty, and teaching styles before registration.",
    keywords: "COMSATS faculty reviews, professor reviews COMSATS, teacher ratings, COMSATS professors, student reviews",
    canonical: "/faculty",
  },
  
  resources: {
    title: "COMSATS Study Resources - Notes, Books & Learning Material",
    description: "Free study resources, notes, books, and learning materials for COMSATS students. Department-wise resources for all courses and semesters.",
    keywords: "COMSATS study material, COMSATS notes, study resources, course material, learning resources",
    canonical: "/resources",
  },
  
  timetable: {
    title: "COMSATS Timetable - Upload, View & Download Class Schedules",
    description: "Upload, preview, and download COMSATS University timetables. Manage your class schedules efficiently with our timetable tool.",
    keywords: "COMSATS timetable, class schedule, COMSATS timings, semester schedule",
    canonical: "/timetable",
  },
}

// Faculty profile SEO template
export function getFacultyProfileSEO(faculty: {
  name: string
  title?: string
  department?: string
  specialization?: string[]
  averageRating?: number
  totalReviews?: number
}) {
  const rating = faculty.averageRating ? ` - ${faculty.averageRating}/5 Rating` : ''
  const reviews = faculty.totalReviews ? ` (${faculty.totalReviews} Reviews)` : ''
  const dept = faculty.department || 'COMSATS'
  const spec = faculty.specialization?.join(', ') || ''
  
  return {
    title: `${faculty.name} - ${faculty.title || 'Professor'} at COMSATS${rating}`,
    description: `Read student reviews and ratings for ${faculty.name}, ${faculty.title || 'Professor'} at ${dept}, COMSATS University Lahore${reviews}. ${spec ? `Specializes in ${spec}.` : ''} Find course difficulty, teaching style, and more.`,
    keywords: `${faculty.name} COMSATS, Professor ${faculty.name}, ${faculty.name} reviews, ${dept} faculty, COMSATS ${dept}`,
  }
}

// Blog post SEO template
export function getBlogPostSEO(post: {
  title: string
  excerpt?: string
  author?: string
  tags?: string[]
  publishedAt?: string
}) {
  return {
    title: `${post.title} - CampusAxis Blog`,
    description: post.excerpt || `Read ${post.title} on CampusAxis Blog. Latest news, tips, and guides for COMSATS University students.`,
    keywords: post.tags?.join(', ') || 'COMSATS blog, student blog, university blog',
    author: post.author || siteConfig.author.name,
    publishedTime: post.publishedAt,
    type: 'article',
  }
}

// News article SEO template
export function getNewsArticleSEO(article: {
  title: string
  summary?: string
  campus?: string
  publishedAt?: string
}) {
  return {
    title: `${article.title} - COMSATS News`,
    description: article.summary || `Latest news from COMSATS University${article.campus ? ` ${article.campus}` : ''}. Stay updated with campus events, announcements, and activities.`,
    keywords: `COMSATS news, ${article.campus || 'COMSATS'} news, university news, campus updates`,
    publishedTime: article.publishedAt,
    type: 'article',
  }
}

// Department page SEO template
export function getDepartmentSEO(department: {
  name: string
  code?: string
  facultyCount?: number
  coursesCount?: number
}) {
  return {
    title: `${department.name} - COMSATS University Department`,
    description: `Explore ${department.name} at COMSATS University Lahore. ${department.facultyCount ? `${department.facultyCount} faculty members, ` : ''}${department.coursesCount ? `${department.coursesCount} courses, ` : ''}study resources, and student reviews.`,
    keywords: `COMSATS ${department.name}, ${department.code || ''} department, COMSATS departments`,
  }
}

// SEO Best Practices Constants
export const SEO_LIMITS = {
  titleLength: { min: 50, max: 60, ideal: 55 },
  descriptionLength: { min: 150, max: 160, ideal: 155 },
  keywordsCount: { min: 5, max: 15, ideal: 10 },
  h1Count: 1,
  imageAlt: { min: 10, max: 125 },
  urlLength: { max: 100, ideal: 75 },
} as const

// Priority Pages for SEO (for sitemap priority and indexing)
export const PRIORITY_PAGES = {
  high: [
    '/',
    '/gpa-calculator',
    '/gpa-calculator/semester',
    '/gpa-calculator/cumulative',
    '/past-papers',
    '/faculty',
  ],
  medium: [
    '/news',
    '/blog',
    '/resources',
    '/community',
    '/timetable',
    '/gpa-calculator/aggregate',
    '/gpa-calculator/planning',
  ],
  low: [
    '/about',
    '/contact',
    '/support',
    '/legal/privacy-policy',
    '/legal/terms-of-service',
  ],
} as const

// Internal Linking Strategy for better SEO and user navigation
export const INTERNAL_LINKS = {
  gpaCalculator: {
    related: [
      { title: 'Past Papers', url: '/past-papers', description: 'Download previous exam papers' },
      { title: 'Study Resources', url: '/resources', description: 'Access study materials' },
      { title: 'Timetable', url: '/timetable', description: 'Manage your class schedule' },
      { title: 'Academic Blog', url: '/blog', description: 'Tips for academic success' },
    ],
  },
  faculty: {
    related: [
      { title: 'Community Forum', url: '/community', description: 'Discuss with students' },
      { title: 'Course Selection Tips', url: '/guidance', description: 'Choose the right courses' },
      { title: 'GPA Calculator', url: '/gpa-calculator', description: 'Calculate your GPA' },
    ],
  },
  pastPapers: {
    related: [
      { title: 'GPA Calculator', url: '/gpa-calculator', description: 'Calculate your GPA' },
      { title: 'Faculty Reviews', url: '/faculty', description: 'Read professor reviews' },
      { title: 'Study Tips', url: '/blog', description: 'Learn effective study methods' },
      { title: 'Resources', url: '/resources', description: 'Additional study materials' },
    ],
  },
  news: {
    related: [
      { title: 'Events Calendar', url: '/news-events', description: 'Upcoming campus events' },
      { title: 'Scholarships', url: '/scholarships', description: 'Available scholarships' },
      { title: 'Community', url: '/community', description: 'Join student discussions' },
    ],
  },
} as const

// Rich Snippets Configuration
export const RICH_SNIPPETS = {
  enableReviewStars: true,
  enableFAQ: true,
  enableHowTo: true,
  enableBreadcrumbs: true,
  enableArticle: true,
  enableEvent: true,
  enableCourse: true,
  enableWebApplication: true,
  enableLocalBusiness: true,
} as const

// FAQ content for GPA Calculator page
export const GPA_CALCULATOR_FAQS = [
  {
    question: 'How is GPA calculated at COMSATS University?',
    answer: 'At COMSATS University, GPA is calculated using the weighted average method. The formula is: (Sum of Grade Points × Credit Hours) / Total Credit Hours. Our calculator automates this process for accurate results based on the official COMSATS grading scale.'
  },
  {
    question: 'What is the grading scale at COMSATS?',
    answer: 'COMSATS uses a 4.0 grading scale with the following grades: A+/A (4.0), A- (3.67), B+ (3.33), B (3.0), B- (2.67), C+ (2.33), C (2.0), C- (1.67), D (1.0), and F (0.0). Each grade corresponds to a specific percentage range.'
  },
  {
    question: 'Is this GPA calculator accurate for COMSATS University Islamabad?',
    answer: 'Yes, our GPA calculator is specifically designed for COMSATS University Islamabad (all campuses including Lahore) and follows the official grading system and formulas published by the university.'
  },
  {
    question: 'Can I use this calculator for all COMSATS campuses?',
    answer: 'Absolutely! This calculator works for all COMSATS University Islamabad campuses including Lahore, Islamabad, Attock, Abbottabad, Wah, Vehari, and Sahiwal as they all follow the same grading system.'
  },
  {
    question: 'How can I improve my COMSATS GPA?',
    answer: 'Focus on consistent performance across all components: quizzes (10-15%), assignments (10-15%), midterm (30%), and final exam (40-50%). Use our GPA planning calculator to set realistic targets for upcoming semesters and track your progress.'
  },
  {
    question: 'What is a good GPA at COMSATS University?',
    answer: 'A GPA of 3.0 or higher is generally considered good at COMSATS. A GPA above 3.5 is excellent and may qualify you for scholarships. A GPA of 3.7+ is considered outstanding and can open doors to competitive opportunities.'
  },
  {
    question: 'Do I need to create an account to use the GPA calculator?',
    answer: 'No, our COMSATS GPA calculator is completely free and requires no registration or login. You can start calculating your GPA immediately without any signup process.'
  },
  {
    question: 'Can I save my GPA calculations?',
    answer: 'If you create a free account on CampusAxis, you can save your GPA calculations, track your progress over time, and access additional features like personalized academic planning.'
  }
] as const

// HowTo steps for GPA Calculator
export const GPA_CALCULATOR_HOWTO = {
  name: 'How to Calculate Your COMSATS GPA',
  description: 'Step-by-step guide to calculate your GPA at COMSATS University using our free calculator',
  steps: [
    'Select the appropriate calculator: Semester GPA, Cumulative CGPA, Aggregate, or Planning',
    'Enter the number of courses you want to calculate',
    'For each course, input the course name, credit hours, and the grade you received (A+, A, A-, B+, etc.)',
    'The calculator will automatically compute your GPA using the COMSATS grading scale',
    'View your calculated GPA and detailed breakdown of grade points',
    'Use the GPA planning tool to set targets for future semesters'
  ]
} as const

export default siteConfig
