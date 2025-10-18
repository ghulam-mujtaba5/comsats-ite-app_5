/**
 * SEO Configuration and Constants
 * Central hub for all SEO-related settings
 */

export const SEO_CONFIG = {
  // Site Information
  siteName: 'CampusAxis',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site',
  siteDescription: 'Ultimate academic portal for COMSATS University students. Access GPA calculator, past papers, faculty reviews, timetables, and study resources across all campuses.',
  
  // Organization
  organization: {
    name: 'CampusAxis',
    legalName: 'CampusAxis - COMSATS Student Portal',
    foundingDate: '2024',
    logo: '/logo.png',
    email: 'support@campusaxis.site',
    contactPoint: {
      contactType: 'Customer Support',
      email: 'support@campusaxis.site',
      availableLanguage: ['en', 'ur']
    },
    sameAs: [
      'https://www.facebook.com/campusaxis',
      'https://twitter.com/campusaxis',
      'https://www.linkedin.com/company/campusaxis',
      'https://www.instagram.com/campusaxis'
    ]
  },

  // Default Meta Tags
  defaultMeta: {
    title: 'CampusAxis - COMSATS University Student Portal',
    titleTemplate: '%s | CampusAxis',
    description: 'Your ultimate academic portal for COMSATS University. Calculate GPA, download past papers, read faculty reviews, and access study resources.',
    keywords: [
      'COMSATS',
      'COMSATS University',
      'CampusAxis',
      'GPA calculator',
      'past papers',
      'faculty reviews',
      'student portal',
      'academic resources',
      'COMSATS Islamabad',
      'COMSATS Lahore',
      'Pakistan university'
    ],
    robots: 'index, follow',
    googlebot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#4573df',
    colorScheme: 'light dark'
  },

  // Open Graph Defaults
  openGraph: {
    type: 'website',
    siteName: 'CampusAxis',
    locale: 'en_PK',
    images: {
      width: 1200,
      height: 630,
      alt: 'CampusAxis - COMSATS Student Portal'
    }
  },

  // Twitter Card Defaults
  twitter: {
    card: 'summary_large_image',
    site: '@campusaxis',
    creator: '@campusaxis'
  },

  // Primary Target Keywords (High Priority)
  primaryKeywords: [
    {
      keyword: 'COMSATS GPA calculator',
      searchVolume: 1200,
      difficulty: 'medium',
      intent: 'transactional',
      targetUrl: '/comsats-gpa-calculator',
      priority: 'critical'
    },
    {
      keyword: 'COMSATS past papers',
      searchVolume: 2500,
      difficulty: 'medium',
      intent: 'informational',
      targetUrl: '/comsats-past-papers',
      priority: 'critical'
    },
    {
      keyword: 'COMSATS timetable',
      searchVolume: 1800,
      difficulty: 'low',
      intent: 'navigational',
      targetUrl: '/timetable',
      priority: 'critical'
    },
    {
      keyword: 'COMSATS faculty reviews',
      searchVolume: 600,
      difficulty: 'low',
      intent: 'informational',
      targetUrl: '/faculty',
      priority: 'high'
    },
    {
      keyword: 'COMSATS student portal',
      searchVolume: 900,
      difficulty: 'medium',
      intent: 'navigational',
      targetUrl: '/',
      priority: 'high'
    }
  ],

  // Secondary Keywords
  secondaryKeywords: [
    'COMSATS grading system',
    'COMSATS CGPA calculator',
    'COMSATS semester GPA',
    'download COMSATS papers',
    'COMSATS Lahore past papers',
    'COMSATS Islamabad GPA',
    'COMSATS merit calculator',
    'COMSATS course reviews',
    'COMSATS class schedule',
    'COMSATS academic resources'
  ],

  // Long-tail Keywords
  longTailKeywords: [
    'how to calculate COMSATS GPA',
    'COMSATS GPA calculator online free',
    'COMSATS Computer Science past papers',
    'best teachers at COMSATS',
    'COMSATS Lahore vs Islamabad',
    'COMSATS scholarship GPA requirements',
    'COMSATS grading scale 2025',
    'download COMSATS mid term papers'
  ],

  // Campuses (for Local SEO)
  campuses: [
    {
      name: 'Islamabad',
      fullName: 'COMSATS University Islamabad',
      slug: 'islamabad',
      coordinates: { lat: 33.6513, lng: 72.9845 },
      address: 'Park Road, Islamabad, 45550',
      region: 'Islamabad Capital Territory',
      priority: 'primary'
    },
    {
      name: 'Lahore',
      fullName: 'COMSATS University Lahore',
      slug: 'lahore',
      coordinates: { lat: 31.4820, lng: 74.3167 },
      address: 'Defence Road, Off Raiwind Road, Lahore',
      region: 'Punjab',
      priority: 'primary'
    },
    {
      name: 'Attock',
      fullName: 'COMSATS University Attock',
      slug: 'attock',
      coordinates: { lat: 33.7681, lng: 72.3604 },
      address: 'Kamra Road, Attock',
      region: 'Punjab',
      priority: 'secondary'
    },
    {
      name: 'Wah',
      fullName: 'COMSATS University Wah',
      slug: 'wah',
      coordinates: { lat: 33.7969, lng: 72.7297 },
      address: 'Wah Cantt',
      region: 'Punjab',
      priority: 'secondary'
    },
    {
      name: 'Abbottabad',
      fullName: 'COMSATS University Abbottabad',
      slug: 'abbottabad',
      coordinates: { lat: 34.1495, lng: 73.2195 },
      address: 'University Road, Abbottabad',
      region: 'Khyber Pakhtunkhwa',
      priority: 'secondary'
    },
    {
      name: 'Sahiwal',
      fullName: 'COMSATS University Sahiwal',
      slug: 'sahiwal',
      coordinates: { lat: 30.6682, lng: 73.1114 },
      address: 'Sahiwal',
      region: 'Punjab',
      priority: 'tertiary'
    },
    {
      name: 'Vehari',
      fullName: 'COMSATS University Vehari',
      slug: 'vehari',
      coordinates: { lat: 30.0333, lng: 72.3500 },
      address: 'Vehari',
      region: 'Punjab',
      priority: 'tertiary'
    }
  ],

  // Content Clusters
  contentClusters: {
    'gpa-calculator': {
      pillar: '/comsats-gpa-calculator',
      clusters: [
        '/gpa-calculator/semester',
        '/gpa-calculator/cumulative',
        '/gpa-calculator/planning',
        '/blog/comsats-grading-system',
        '/blog/how-to-calculate-gpa',
        '/blog/gpa-improvement-tips'
      ]
    },
    'past-papers': {
      pillar: '/comsats-past-papers',
      clusters: [
        '/past-papers',
        '/blog/how-to-use-past-papers',
        '/blog/exam-preparation-guide',
        '/blog/past-papers-strategy'
      ]
    },
    'faculty-reviews': {
      pillar: '/faculty',
      clusters: [
        '/faculty/reviews',
        '/blog/choosing-courses',
        '/blog/faculty-rating-guide'
      ]
    },
    'admissions': {
      pillar: '/admissions',
      clusters: [
        '/admissions',
        '/merit-list-2025',
        '/blog/admission-guide',
        '/blog/entry-test-preparation'
      ]
    }
  },

  // Competitor Analysis
  competitors: [
    {
      name: 'cuonline.pk',
      strengths: ['Official COMSATS site', 'High authority'],
      weaknesses: ['Poor UX', 'Limited tools', 'Slow loading'],
      strategy: 'Better UX, more tools, faster performance'
    },
    {
      name: 'ilmkidunya.com',
      strengths: ['High DA', 'Large content base'],
      weaknesses: ['Generic content', 'Not COMSATS-specific'],
      strategy: 'Hyper-targeted COMSATS content'
    },
    {
      name: 'Various GPA calculators',
      strengths: ['Simple tools'],
      weaknesses: ['Single-purpose', 'No community'],
      strategy: 'Comprehensive platform with community'
    }
  ],

  // Structured Data Priorities
  structuredDataPriority: [
    'Organization',
    'WebSite',
    'SoftwareApplication', // GPA Calculator
    'LocalBusiness', // Campuses
    'FAQPage',
    'HowTo',
    'Course',
    'BreadcrumbList',
    'Article',
    'Review',
    'AggregateRating'
  ],

  // Internal Linking Strategy
  internalLinking: {
    maxLinksPerPage: 100,
    minLinksPerPage: 5,
    priorityPages: [
      '/',
      '/comsats-gpa-calculator',
      '/comsats-past-papers',
      '/faculty',
      '/timetable',
      '/admissions'
    ],
    anchorTextVariation: true,
    followLinkRatio: 0.95 // 95% follow, 5% nofollow
  },

  // Performance Targets
  performanceTargets: {
    lcp: 2.5, // Largest Contentful Paint (seconds)
    fid: 100, // First Input Delay (milliseconds)
    cls: 0.1, // Cumulative Layout Shift
    ttfb: 600, // Time to First Byte (milliseconds)
    fcp: 1.8, // First Contentful Paint (seconds)
    tti: 3.8, // Time to Interactive (seconds)
    speedIndex: 3.4
  },

  // Indexing Strategy
  indexing: {
    priority: {
      critical: ['/', '/comsats-gpa-calculator', '/comsats-past-papers'],
      high: ['/faculty', '/timetable', '/admissions', '/community'],
      medium: ['/blog/*', '/news/*', '/resources'],
      low: ['/about', '/contact', '/legal/*']
    },
    crawlBudget: {
      optimized: true,
      maxPagesPerCrawl: 1000,
      crawlDelay: 1
    },
    sitemapPriority: {
      homepage: 1.0,
      pillars: 0.9,
      clusters: 0.7,
      supporting: 0.5,
      utility: 0.3
    }
  }
}

// Helper Functions
export function getSiteUrl(path: string = ''): string {
  return `${SEO_CONFIG.siteUrl}${path}`
}

export function getMetaTitle(title: string): string {
  return title.includes('|') ? title : `${title} | ${SEO_CONFIG.siteName}`
}

export function getCampusBySlug(slug: string) {
  return SEO_CONFIG.campuses.find(c => c.slug === slug)
}

export function getPrimaryKeywordByUrl(url: string) {
  return SEO_CONFIG.primaryKeywords.find(k => k.targetUrl === url)
}

export function getContentCluster(pillarUrl: string) {
  return Object.values(SEO_CONFIG.contentClusters).find(c => c.pillar === pillarUrl)
}

export default SEO_CONFIG
