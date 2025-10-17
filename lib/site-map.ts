export type PageStatus = 'live' | 'beta' | 'coming_soon' | 'working'

export type SiteLink = {
  label: string
  href: string
  status?: PageStatus
  group: 'core' | 'student' | 'community' | 'support' | 'admissions'
}

// Central source of truth for footer and other navs
export const SITE_LINKS: SiteLink[] = [
  // Core
  { label: 'Home', href: '/', status: 'live', group: 'core' },
  { label: 'About', href: '/about', status: 'beta', group: 'core' },
  { label: 'News & Events', href: '/news-events', status: 'live', group: 'core' },
  { label: 'Blog: Grading System', href: '/blog/comsats-grading-system', status: 'beta', group: 'core' },
  { label: 'Search', href: '/search', status: 'working', group: 'core' },
  { label: 'Admin', href: '/admin', status: 'live', group: 'core' }, // Added Admin link

  // Student tools
  { label: 'Community', href: '/community', status: 'live', group: 'student' }, // Added Community
  { label: 'Past Papers', href: '/past-papers', status: 'live', group: 'student' },
  { label: 'Timetable', href: '/timetable', status: 'live', group: 'student' },
  { label: 'GPA Calculator', href: '/gpa-calculator', status: 'live', group: 'student' },
  { label: 'Resources', href: '/resources', status: 'beta', group: 'student' },
  { label: 'Guidance', href: '/guidance', status: 'live', group: 'student' }, // Changed from coming_soon to live
  { label: 'Student Support', href: '/student-support', status: 'live', group: 'student' }, // Added Student Support
  { label: 'Test Preparation', href: '/test-preparation', status: 'beta', group: 'student' }, // Added Test Preparation
  { label: 'Study Groups', href: '/study-groups', status: 'beta', group: 'student' }, // Added Study Groups

  // Admissions (new consolidated group)
  { label: 'Admissions', href: '/admissions', status: 'live', group: 'admissions' },
  { label: 'Merit List 2025', href: '/merit-list-2025', status: 'live', group: 'admissions' },
  { label: 'Fee Challan Reissuance', href: '/fee-challan-reissuance', status: 'live', group: 'admissions' },
  { label: 'Scholarships', href: '/scholarships', status: 'live', group: 'admissions' },

  // Community
  { label: 'Faculty Reviews', href: '/faculty', status: 'working', group: 'community' },
  { label: 'Lost & Found', href: '/lost-found', status: 'live', group: 'community' },
  { label: 'Groups', href: '/community/groups', status: 'live', group: 'community' }, // Added Groups subpage
  { label: 'Events', href: '/community/events', status: 'live', group: 'community' }, // Added Events subpage

  // Support & Legal
  { label: 'Alumni', href: '/alumni', status: 'live', group: 'support' }, // Added Alumni
  { label: 'Contribute', href: '/contribute', status: 'live', group: 'support' },
  { label: 'Report an Issue', href: '/report-issue', status: 'live', group: 'support' },
  { label: 'Contact', href: '/contact', status: 'beta', group: 'support' },
  { label: 'Help Center', href: '/help', status: 'live', group: 'support' }, // Updated from coming_soon to live
  { label: 'Privacy Policy', href: '/legal/privacy-policy', status: 'live', group: 'support' },
  { label: 'Terms of Service', href: '/legal/terms-of-service', status: 'live', group: 'support' },
]