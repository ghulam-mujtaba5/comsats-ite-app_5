/**
 * Advanced Schema.org Structured Data Library
 * Comprehensive structured data for maximum SEO impact
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'

// ==================== SOFTWARE APPLICATION ====================
export function createSoftwareApplicationSchema(app: {
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem?: string
  offers?: {
    price: string
    priceCurrency?: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
  screenshot?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    url: app.url,
    applicationCategory: app.applicationCategory,
    operatingSystem: app.operatingSystem || 'Web Browser',
    offers: app.offers ? {
      '@type': 'Offer',
      price: app.offers.price,
      priceCurrency: app.offers.priceCurrency || 'PKR'
    } : {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'PKR'
    },
    ...(app.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: app.aggregateRating.ratingValue,
        reviewCount: app.aggregateRating.reviewCount
      }
    }),
    ...(app.screenshot && {
      screenshot: app.screenshot
    })
  }
}

// GPA Calculator Schema
export function createGPACalculatorSchema() {
  return createSoftwareApplicationSchema({
    name: 'COMSATS GPA Calculator - Free Online CGPA Calculator',
    description: 'Calculate your COMSATS University GPA and CGPA instantly. Free, accurate, and easy-to-use semester and cumulative GPA calculator for all COMSATS campuses.',
    url: `${siteUrl}/gpa-calculator`,
    applicationCategory: 'EducationalApplication',
    offers: {
      price: '0'
    },
    aggregateRating: {
      ratingValue: 4.8,
      reviewCount: 1250
    }
  })
}

// ==================== HOW-TO GUIDES ====================
export function createHowToSchema(guide: {
  name: string
  description: string
  image?: string
  totalTime?: string
  steps: Array<{
    name: string
    text: string
    url?: string
    image?: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.name,
    description: guide.description,
    ...(guide.image && { image: guide.image }),
    ...(guide.totalTime && { totalTime: guide.totalTime }),
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && { image: step.image })
    }))
  }
}

// GPA Calculation How-To
export function createGPACalculationHowTo() {
  return createHowToSchema({
    name: 'How to Calculate Your COMSATS GPA',
    description: 'Step-by-step guide to calculating your semester GPA and cumulative CGPA for COMSATS University.',
    totalTime: 'PT5M',
    steps: [
      {
        name: 'Enter Your Courses',
        text: 'Add all courses from your current semester including course codes and credit hours.'
      },
      {
        name: 'Input Your Grades',
        text: 'Enter the letter grade (A, A-, B+, etc.) you received for each course.'
      },
      {
        name: 'Add Previous CGPA (Optional)',
        text: 'If calculating cumulative GPA, enter your previous CGPA and total credit hours completed.'
      },
      {
        name: 'Calculate Results',
        text: 'Click calculate to see your semester GPA and updated cumulative CGPA instantly.'
      }
    ]
  })
}

// ==================== EDUCATIONAL COURSE ====================
export function createCourseSchema(course: {
  name: string
  description: string
  provider: string
  courseCode?: string
  numberOfCredits?: number
  hasCourseInstance?: {
    courseMode?: string
    instructor?: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      sameAs: 'https://comsats.edu.pk'
    },
    ...(course.courseCode && { courseCode: course.courseCode }),
    ...(course.numberOfCredits && { numberOfCredits: course.numberOfCredits }),
    ...(course.hasCourseInstance && {
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: course.hasCourseInstance.courseMode || 'on-campus',
        ...(course.hasCourseInstance.instructor && {
          instructor: {
            '@type': 'Person',
            name: course.hasCourseInstance.instructor
          }
        })
      }
    })
  }
}

// ==================== LOCAL BUSINESS (CAMPUS) ====================
export function createCampusSchema(campus: {
  name: string
  description: string
  address: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  telephone?: string
  email?: string
  geo?: {
    latitude: string
    longitude: string
  }
  areaServed?: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: campus.name,
    description: campus.description,
    address: {
      '@type': 'PostalAddress',
      ...campus.address
    },
    ...(campus.telephone && { telephone: campus.telephone }),
    ...(campus.email && { email: campus.email }),
    ...(campus.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: campus.geo.latitude,
        longitude: campus.geo.longitude
      }
    }),
    ...(campus.areaServed && {
      areaServed: {
        '@type': 'City',
        name: campus.areaServed
      }
    }),
    url: campus.url || siteUrl,
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: 'COMSATS University Islamabad',
      url: 'https://comsats.edu.pk'
    }
  }
}

// All COMSATS Campuses
export const comcatsampuses = [
  {
    name: 'CampusAxis - COMSATS Islamabad Campus Portal',
    description: 'Complete academic portal for COMSATS University Islamabad campus students. Access GPA calculator, past papers, timetables, and faculty reviews.',
    address: {
      streetAddress: 'Park Road',
      addressLocality: 'Islamabad',
      addressRegion: 'Islamabad Capital Territory',
      postalCode: '45550',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '33.6513',
      longitude: '72.9845'
    },
    areaServed: 'Islamabad',
    url: `${siteUrl}/campus/islamabad`
  },
  {
    name: 'CampusAxis - COMSATS Lahore Campus Portal',
    description: 'Academic resources and tools for COMSATS Lahore campus students including GPA calculator, past papers, and study materials.',
    address: {
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '31.4820',
      longitude: '74.3167'
    },
    areaServed: 'Lahore',
    url: `${siteUrl}/campus/lahore`
  },
  {
    name: 'CampusAxis - COMSATS Attock Campus Portal',
    description: 'Student portal for COMSATS Attock campus with GPA calculators, past papers, and academic resources.',
    address: {
      addressLocality: 'Attock',
      addressRegion: 'Punjab',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '33.7681',
      longitude: '72.3604'
    },
    areaServed: 'Attock',
    url: `${siteUrl}/campus/attock`
  },
  {
    name: 'CampusAxis - COMSATS Wah Campus Portal',
    description: 'Comprehensive academic tools for COMSATS Wah campus students.',
    address: {
      addressLocality: 'Wah Cantt',
      addressRegion: 'Punjab',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '33.7969',
      longitude: '72.7297'
    },
    areaServed: 'Wah Cantt',
    url: `${siteUrl}/campus/wah`
  },
  {
    name: 'CampusAxis - COMSATS Abbottabad Campus Portal',
    description: 'Student resources for COMSATS Abbottabad campus.',
    address: {
      addressLocality: 'Abbottabad',
      addressRegion: 'Khyber Pakhtunkhwa',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '34.1495',
      longitude: '73.2195'
    },
    areaServed: 'Abbottabad',
    url: `${siteUrl}/campus/abbottabad`
  },
  {
    name: 'CampusAxis - COMSATS Sahiwal Campus Portal',
    description: 'Academic portal for COMSATS Sahiwal campus students.',
    address: {
      addressLocality: 'Sahiwal',
      addressRegion: 'Punjab',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '30.6682',
      longitude: '73.1114'
    },
    areaServed: 'Sahiwal',
    url: `${siteUrl}/campus/sahiwal`
  },
  {
    name: 'CampusAxis - COMSATS Vehari Campus Portal',
    description: 'Student tools and resources for COMSATS Vehari campus.',
    address: {
      addressLocality: 'Vehari',
      addressRegion: 'Punjab',
      addressCountry: 'PK'
    },
    geo: {
      latitude: '30.0333',
      longitude: '72.3500'
    },
    areaServed: 'Vehari',
    url: `${siteUrl}/campus/vehari`
  }
]

// ==================== FAQ PAGE ====================
export function createFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// GPA Calculator FAQs
export function createGPACalculatorFAQs() {
  return createFAQPageSchema([
    {
      question: 'How do I calculate my COMSATS GPA?',
      answer: 'To calculate your COMSATS GPA: (1) Enter each course and its credit hours, (2) Input your letter grade for each course, (3) The calculator automatically computes your GPA using the COMSATS grading scale where A=4.0, A-=3.67, B+=3.33, B=3.0, etc.'
    },
    {
      question: 'What is the difference between GPA and CGPA at COMSATS?',
      answer: 'GPA (Grade Point Average) is your performance in a single semester, while CGPA (Cumulative Grade Point Average) is your overall performance across all completed semesters at COMSATS University.'
    },
    {
      question: 'What GPA do I need for a scholarship at COMSATS?',
      answer: 'For COMSATS merit scholarships: 100% fee waiver requires CGPA ≥ 3.75, 50% requires CGPA ≥ 3.50, and 25% requires CGPA ≥ 3.25. Requirements may vary by campus and program.'
    },
    {
      question: 'How is the COMSATS grading system calculated?',
      answer: 'COMSATS uses a 4.0 scale: A (85-100%) = 4.0, A- (80-84%) = 3.67, B+ (75-79%) = 3.33, B (71-74%) = 3.0, B- (68-70%) = 2.67, C+ (64-67%) = 2.33, C (61-63%) = 2.0, C- (58-60%) = 1.67, D+ (54-57%) = 1.33, D (50-53%) = 1.0, F (below 50%) = 0.0'
    },
    {
      question: 'Can I use this calculator for all COMSATS campuses?',
      answer: 'Yes! This GPA calculator works for all COMSATS campuses including Islamabad, Lahore, Attock, Wah, Abbottabad, Sahiwal, and Vehari as they all follow the same grading system.'
    },
    {
      question: 'Is the GPA calculator accurate?',
      answer: 'Yes, our calculator uses the official COMSATS grading formula. However, always verify your official GPA from the COMSATS student portal as some courses may have special grading considerations.'
    },
    {
      question: 'How do I improve my COMSATS GPA?',
      answer: 'To improve your GPA: (1) Focus on high credit hour courses for maximum impact, (2) Attend classes regularly, (3) Complete assignments on time, (4) Use past papers for exam preparation, (5) Seek help from faculty during office hours, (6) Form study groups with peers.'
    },
    {
      question: 'What happens if I fail a course at COMSATS?',
      answer: 'A failed course (F grade = 0.0) is included in your CGPA calculation. You must retake and pass the course. When you retake it, both grades appear on your transcript, but typically only the higher grade counts toward your CGPA. Check your campus policy for specifics.'
    }
  ])
}

// Past Papers FAQs
export function createPastPapersFAQs() {
  return createFAQPageSchema([
    {
      question: 'Where can I find COMSATS past papers?',
      answer: 'CampusAxis provides a comprehensive collection of COMSATS past papers for all campuses, departments, and courses. Papers are organized by semester, year, and subject for easy access.'
    },
    {
      question: 'Are the past papers official?',
      answer: 'Past papers are contributed by students who have taken the exams. While we verify submissions, always use them as study guides rather than sole preparation materials.'
    },
    {
      question: 'How do I download past papers?',
      answer: 'Simply browse by campus and course, find the paper you need, and click the download button. All past papers are free to download for registered students.'
    },
    {
      question: 'Can I contribute my past papers?',
      answer: 'Yes! We encourage students to share their past papers to help the community. You can upload papers through your student dashboard and earn contribution points.'
    },
    {
      question: 'Are past papers useful for exam preparation?',
      answer: 'Absolutely! Past papers help you understand exam patterns, identify frequently asked questions, practice time management, and familiarize yourself with the question format used by different instructors.'
    }
  ])
}

// ==================== ARTICLE/BLOG POST ====================
export function createArticleSchema(article: {
  headline: string
  description: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
  publisher?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    ...(article.image && {
      image: article.image
    }),
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'CampusAxis Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher || 'CampusAxis',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    }
  }
}

// ==================== BREADCRUMB ====================
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// ==================== PERSON (FACULTY) ====================
export function createPersonSchema(person: {
  name: string
  jobTitle?: string
  description?: string
  image?: string
  email?: string
  worksFor?: string
  alumniOf?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.description && { description: person.description }),
    ...(person.image && { image: person.image }),
    ...(person.email && { email: person.email }),
    ...(person.worksFor && {
      worksFor: {
        '@type': 'Organization',
        name: person.worksFor
      }
    }),
    ...(person.alumniOf && {
      alumniOf: {
        '@type': 'Organization',
        name: person.alumniOf
      }
    })
  }
}

// ==================== REVIEW ====================
export function createReviewSchema(review: {
  itemReviewed: {
    type: string
    name: string
  }
  author: string
  reviewRating: {
    ratingValue: number
    bestRating?: number
  }
  datePublished: string
  reviewBody: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': review.itemReviewed.type,
      name: review.itemReviewed.name
    },
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating.ratingValue,
      bestRating: review.reviewRating.bestRating || 5
    },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody
  }
}

// ==================== AGGREGATE RATING ====================
export function createAggregateRatingSchema(rating: {
  itemReviewed: {
    type: string
    name: string
  }
  ratingValue: number
  reviewCount: number
  bestRating?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': rating.itemReviewed.type,
    name: rating.itemReviewed.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
      bestRating: rating.bestRating || 5
    }
  }
}

// ==================== ITEM LIST ====================
export function createItemListSchema(items: Array<{
  name: string
  url: string
  image?: string
  description?: string
}>, listName?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(listName && { name: listName }),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description })
      }
    }))
  }
}

// ==================== WEB SITE SEARCH ====================
export function createWebSiteSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// ==================== ORGANIZATION ====================
export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CampusAxis',
    description: 'Ultimate academic portal for COMSATS University students across all campuses. Access GPA calculator, past papers, faculty reviews, timetables, and study resources.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://www.facebook.com/campusaxis',
      'https://twitter.com/campusaxis',
      'https://www.linkedin.com/company/campusaxis'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@campusaxis.site'
    }
  }
}
