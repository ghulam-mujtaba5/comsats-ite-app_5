export type PageStatus = 'live' | 'beta' | 'coming_soon' | 'working'

export type SiteLink = {
  label: string
  href: string
  status?: PageStatus
  group: 'core' | 'student' | 'community' | 'support'
}

// Central source of truth for footer and other navs
export const SITE_LINKS: SiteLink[] = [
  // Core
  { label: 'Home', href: '/', status: 'live', group: 'core' },
  { label: 'About', href: '/about', status: 'beta', group: 'core' },
  { label: 'News & Events', href: '/news-events', status: 'live', group: 'core' },
  { label: 'Blog: Grading System', href: '/blog/comsats-grading-system', status: 'beta', group: 'core' },
  { label: 'Search', href: '/search', status: 'working', group: 'core' },

  // Student tools
  { label: 'Past Papers', href: '/past-papers', status: 'live', group: 'student' },
  { label: 'Timetable', href: '/timetable', status: 'live', group: 'student' },
  { label: 'GPA Calculator', href: '/gpa-calculator', status: 'live', group: 'student' },
  { label: 'GPA: Semester', href: '/gpa-calculator/semester', status: 'live', group: 'student' },
  { label: 'GPA: Cumulative', href: '/gpa-calculator/cumulative', status: 'live', group: 'student' },
  { label: 'GPA: Aggregate', href: '/gpa-calculator/aggregate', status: 'live', group: 'student' },
  { label: 'GPA: Planning', href: '/gpa-calculator/planning', status: 'beta', group: 'student' },
  { label: 'Resources', href: '/resources', status: 'beta', group: 'student' },
  { label: 'Guidance', href: '/guidance', status: 'coming_soon', group: 'student' },

  // Community
  { label: 'Faculty Reviews', href: '/faculty', status: 'working', group: 'community' },
  { label: 'Lost & Found', href: '/lost-found', status: 'live', group: 'community' },
  { label: 'Community', href: '/community', status: 'coming_soon', group: 'community' },

  // Support & Legal
  { label: 'Contribute', href: '/contribute', status: 'live', group: 'support' },
  { label: 'Report an Issue', href: '/report-issue', status: 'live', group: 'support' },
  { label: 'Contact', href: '/contact', status: 'beta', group: 'support' },
  { label: 'Help Center', href: '/help', status: 'coming_soon', group: 'support' },
  { label: 'Privacy Policy', href: '/legal/privacy-policy', status: 'live', group: 'support' },
  { label: 'Terms of Service', href: '/legal/terms-of-service', status: 'live', group: 'support' },
  { label: 'Privacy (alt)', href: '/privacy', status: 'live', group: 'support' },
  { label: 'Terms (alt)', href: '/terms', status: 'live', group: 'support' },
]
