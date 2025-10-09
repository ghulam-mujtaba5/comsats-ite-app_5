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
  "logo": "https://campusaxis.site/logo-square.svg",
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

export default siteConfig
