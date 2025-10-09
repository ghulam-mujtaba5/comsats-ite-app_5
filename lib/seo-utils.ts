/**
 * 🎯 SEO Utilities for Generating Perfect Metadata
 * 
 * Helper functions to generate optimized metadata for all pages
 */

import { Metadata } from 'next'
import { siteConfig } from './seo-config'

interface GenerateMetadataProps {
  title: string
  description: string
  keywords?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

export function generateMetadata({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
}: GenerateMetadataProps): Metadata {
  const fullTitle = title.includes('CampusAxis') ? title : `${title} | CampusAxis`
  const url = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url
  const image = ogImage || siteConfig.ogImage

  return {
    title: fullTitle,
    description,
    keywords: keywords || siteConfig.keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: siteConfig.author.name }],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    
    // Robots
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Open Graph
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(ogType === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author || siteConfig.author.name],
        section,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@campusaxis', // Add your Twitter handle
      site: '@campusaxis',
    },

    // Additional metadata
    other: {
      'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
  }
}

// Generate faculty profile metadata
export function generateFacultyMetadata(faculty: {
  id: string
  name: string
  title?: string
  department?: string
  specialization?: string[]
  averageRating?: number
  totalReviews?: number
  profileImage?: string
}) {
  const rating = faculty.averageRating ? ` - ${faculty.averageRating}/5 Rating` : ''
  const reviews = faculty.totalReviews ? ` (${faculty.totalReviews} Reviews)` : ''
  const dept = faculty.department || 'COMSATS'
  const spec = faculty.specialization?.join(', ') || ''

  return generateMetadata({
    title: `${faculty.name} - ${faculty.title || 'Professor'} at COMSATS${rating}`,
    description: `Read student reviews and ratings for ${faculty.name}, ${faculty.title || 'Professor'} at ${dept}, COMSATS University Lahore${reviews}. ${spec ? `Specializes in ${spec}.` : ''} Find course difficulty, teaching style, and more.`,
    keywords: `${faculty.name} COMSATS, Professor ${faculty.name}, ${faculty.name} reviews, ${dept} faculty, COMSATS ${dept}`,
    canonical: `/faculty/${faculty.id}`,
    ogImage: faculty.profileImage || siteConfig.ogImage,
    ogType: 'profile',
  })
}

// Generate blog post metadata
export function generateBlogMetadata(post: {
  slug: string
  title: string
  excerpt?: string
  content?: string
  author?: string
  tags?: string[]
  image?: string
  publishedAt?: string
  updatedAt?: string
}) {
  return generateMetadata({
    title: post.title,
    description: post.excerpt || `Read ${post.title} on CampusAxis Blog. Latest news, tips, and guides for COMSATS University students.`,
    keywords: post.tags?.join(', ') || 'COMSATS blog, student blog, university blog',
    canonical: `/blog/${post.slug}`,
    ogImage: post.image,
    ogType: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author,
    section: 'Education',
  })
}

// Generate news article metadata
export function generateNewsMetadata(article: {
  slug: string
  title: string
  summary?: string
  campus?: string
  image?: string
  publishedAt?: string
  updatedAt?: string
}) {
  return generateMetadata({
    title: `${article.title} - COMSATS News`,
    description: article.summary || `Latest news from COMSATS University${article.campus ? ` ${article.campus}` : ''}. Stay updated with campus events, announcements, and activities.`,
    keywords: `COMSATS news, ${article.campus || 'COMSATS'} news, university news, campus updates`,
    canonical: `/news/${article.slug}`,
    ogImage: article.image,
    ogType: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    section: 'News',
  })
}

// Generate department metadata
export function generateDepartmentMetadata(department: {
  slug: string
  name: string
  code?: string
  description?: string
  facultyCount?: number
  coursesCount?: number
}) {
  return generateMetadata({
    title: `${department.name} - COMSATS University Department`,
    description: department.description || `Explore ${department.name} at COMSATS University Lahore. ${department.facultyCount ? `${department.facultyCount} faculty members, ` : ''}${department.coursesCount ? `${department.coursesCount} courses, ` : ''}study resources, and student reviews.`,
    keywords: `COMSATS ${department.name}, ${department.code || ''} department, COMSATS departments`,
    canonical: `/departments/${department.slug}`,
  })
}

// Generate search results metadata
export function generateSearchMetadata(query: string, resultsCount: number) {
  return generateMetadata({
    title: `Search Results for "${query}"`,
    description: `Found ${resultsCount} results for "${query}" on CampusAxis. Search past papers, faculty reviews, resources, and more.`,
    keywords: `search ${query}, COMSATS search, find ${query}`,
    canonical: `/search?q=${encodeURIComponent(query)}`,
    noindex: true, // Don't index search result pages
  })
}

// Generate breadcrumb data
export function generateBreadcrumbs(items: Array<{ name: string; path: string }>) {
  return [
    { name: 'Home', path: '/' },
    ...items
  ].map(item => ({
    name: item.name,
    url: `${siteConfig.url}${item.path}`
  }))
}

// Format date for schema.org
export function formatSchemaDate(date: string | Date) {
  return new Date(date).toISOString()
}

// Generate canonical URL
export function getCanonicalUrl(path: string) {
  return `${siteConfig.url}${path}`
}

// Generate keywords from content
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ')
  
  // Extract words (3+ characters)
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length >= 3)
    .filter(word => !/^\d+$/.test(word)) // Remove pure numbers
  
  // Count frequency
  const frequency: { [key: string]: number } = {}
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word)
}

// Check if page should be indexed
export function shouldIndex(path: string): boolean {
  const noIndexPaths = [
    '/api/',
    '/admin/',
    '/auth/',
    '/dashboard/',
    '/profile/',
    '/settings/',
    '/search',
  ]
  
  return !noIndexPaths.some(p => path.startsWith(p))
}

// Generate sitemap entry
export function generateSitemapEntry(
  url: string,
  priority: number = 0.5,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  lastmod?: string
) {
  return {
    url: `${siteConfig.url}${url}`,
    lastModified: lastmod || new Date().toISOString(),
    changeFrequency: changefreq,
    priority,
  }
}
