import type { Metadata } from "next"

export type CreateMetadataInput = {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noindex?: boolean
}

// Canonical production domain fallback if env not set
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
const defaultImage = "/placeholder-7ca42.png"

// Remove query strings & normalize trailing slashes except root
export function canonicalizePath(path?: string): string {
  if (!path) return siteUrl
  try {
    // If absolute already
    const u = path.startsWith('http') ? new URL(path) : new URL(path, siteUrl)
    u.search = ''
    // remove trailing slash unless root
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.replace(/\/$/, '')
    }
    return u.toString()
  } catch {
    return new URL('/', siteUrl).toString()
  }
}

export function createMetadata(input: CreateMetadataInput): Metadata {
  const canonical = canonicalizePath(input.path || '/')
  const image = input.image ? new URL(input.image, siteUrl).toString() : new URL(defaultImage, siteUrl).toString()

  const meta: Metadata = {
    title: { default: input.title, template: '%s | CampusAxis' },
    description: input.description,
    alternates: { canonical },
    keywords: input.keywords,
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      url: canonical,
      title: input.title,
      description: input.description,
      siteName: 'CampusAxis',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [{ url: image, alt: input.title }],
    },
  }
  return meta
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CampusAxis",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CampusAxis",
    url: siteUrl,
    logo: `${siteUrl}/new-logo.jpg`,
  }
}

export function jsonLdBreadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: new URL(it.path, siteUrl).toString(),
    })),
  }
}

export function jsonLdFAQ(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}

export function jsonLdPerson(person: {
  name: string
  jobTitle: string
  department: string
  image?: string
  url: string
  email?: string
  phone?: string
  office?: string
  specializations?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: 'COMSATS University Islamabad, Lahore Campus',
    },
    department: person.department,
    image: person.image ? new URL(person.image, siteUrl).toString() : undefined,
    url: new URL(person.url, siteUrl).toString(),
    email: person.email,
    telephone: person.phone,
    workLocation: person.office ? { '@type': 'Place', name: person.office } : undefined,
    knowsAbout: person.specializations,
  };
}

export function jsonLdReview(review: {
  authorName: string
  reviewBody: string
  reviewRating: {
    ratingValue: number
    bestRating: number
    worstRating: number
  }
  itemReviewed: {
    name: string
    url: string
  }
  datePublished: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${siteUrl}#review-${encodeURIComponent(review.itemReviewed.url)}-${review.reviewRating.ratingValue}-${review.datePublished}`,
    author: { '@type': 'Person', name: review.authorName },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating.ratingValue,
      bestRating: review.reviewRating.bestRating,
      worstRating: review.reviewRating.worstRating,
    },
    itemReviewed: {
      '@type': 'Person',
      name: review.itemReviewed.name,
      url: new URL(review.itemReviewed.url, siteUrl).toString(),
    },
    datePublished: review.datePublished,
  };
}

export function jsonLdAggregateRating(rating: {
  ratingValue: number
  reviewCount: number
  bestRating: number
  worstRating: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: rating.ratingValue,
    reviewCount: rating.reviewCount,
    bestRating: rating.bestRating,
    worstRating: rating.worstRating,
  };
}

export function jsonLdItemList(items: Array<{ name: string; url: string; position?: number; image?: string }>, opts?: { itemType?: string; description?: string; }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: it.position || idx + 1,
      url: new URL(it.url, siteUrl).toString(),
      name: it.name,
      image: it.image ? new URL(it.image, siteUrl).toString() : undefined,
    })),
    numberOfItems: items.length,
    description: opts?.description,
    itemListOrder: 'http://schema.org/ItemListOrderAscending',
  }
}

// Build an ItemList JSON-LD for a set of reviews (for rich snippets on list / profile pages)
export function jsonLdReviewList(params: {
  facultyName: string
  facultyUrl: string
  reviews: Array<{
    author: string
    body: string
    rating: number
    date: string
  }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: params.reviews.map((r, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        reviewBody: r.body,
        datePublished: r.date,
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        itemReviewed: { '@type': 'Person', name: params.facultyName, url: new URL(params.facultyUrl, siteUrl).toString() }
      }
    }))
  }
}

export function jsonLdBlogPosting(post: { title: string; description: string; slug: string; datePublished?: string; dateModified?: string; authorName?: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: new URL(`/blog/${post.slug}`, siteUrl).toString(),
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: { '@type': 'Person', name: post.authorName || 'CampusAxis' },
  publisher: { '@type': 'Organization', name: 'CampusAxis', logo: { '@type': 'ImageObject', url: new URL('/new-logo.jpg', siteUrl).toString() } },
    image: post.image ? [new URL(post.image, siteUrl).toString()] : [new URL('/og-preview.png', siteUrl).toString()],
    mainEntityOfPage: { '@type': 'WebPage', '@id': new URL(`/blog/${post.slug}`, siteUrl).toString() },
  }
}

export function jsonLdCourseList(course: { name: string; description?: string; code: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.name} (${course.code})`,
    description: course.description,
    provider: { '@type': 'CollegeOrUniversity', name: 'COMSATS University Islamabad', url: siteUrl },
  }
}

export function jsonLdSiteNavigation(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    about: items.map(i => ({ '@type': 'WebPage', name: i.name, url: new URL(i.url, siteUrl).toString() }))
  }
}

export function jsonLdSpeakable(selectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selectors,
    }
  }
}

// Generic CollectionPage wrapper (e.g., listing pages) with optional itemList
export function jsonLdCollectionPage(params: {
  name: string
  description?: string
  path: string
  items?: Array<{ name: string; url: string; image?: string }>
  itemType?: string
}) {
  const pageUrl = new URL(params.path, siteUrl).toString()
  const collection: any = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: pageUrl,
  }
  if (params.items && params.items.length) {
    collection.mainEntity = jsonLdItemList(
      params.items.map(i => ({ name: i.name, url: i.url, image: i.image })),
      { itemType: params.itemType, description: params.description }
    )
  }
  return collection
}

// NewsArticle helper (useful if we unify news pages later)
export function jsonLdNewsArticle(article: {
  id: string | number
  headline: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  authorName?: string
  section?: string
}) {
  const url = new URL(`/news/${article.id}`, siteUrl).toString()
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#news` ,
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: { '@type': 'Person', name: article.authorName || 'CampusAxis' },
  publisher: { '@type': 'Organization', name: 'CampusAxis', logo: { '@type': 'ImageObject', url: new URL('/new-logo.jpg', siteUrl).toString() } },
    articleSection: article.section,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: article.image ? [new URL(article.image, siteUrl).toString()] : [new URL('/og-preview.png', siteUrl).toString()],
    url,
  }
}

// Event helper for consistency where we cannot fetch everything client-side
export function jsonLdEvent(e: {
  id: string | number
  name: string
  description?: string
  startDate?: string
  endDate?: string
  location?: string
  organizer?: string
  image?: string
  category?: string
  capacity?: number | null
}) {
  const url = new URL(`/news-events/${e.id}`, siteUrl).toString()
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name: e.name,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate,
    location: e.location ? { '@type': 'Place', name: e.location, address: e.location } : undefined,
    organizer: { '@type': 'Organization', name: e.organizer || 'CampusAxis', url: siteUrl },
    image: e.image ? [new URL(e.image, siteUrl).toString()] : undefined,
    url,
    keywords: e.category,
    maximumAttendeeCapacity: e.capacity || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
  }
}

// Course + papers list: expresses a Course with hasPart referencing an ItemList of CreativeWork/Document nodes (lightweight)
export function jsonLdCourseWithPapers(params: {
  courseCode: string
  courseName: string
  path: string
  papers: Array<{ id: string; title: string; url: string; examType?: string; year?: number }>
}) {
  const courseUrl = new URL(params.path, siteUrl).toString()
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${params.courseName} (${params.courseCode})`,
    url: courseUrl,
    provider: { '@type': 'CollegeOrUniversity', name: 'COMSATS University Islamabad', url: siteUrl },
    hasPart: params.papers.slice(0, 50).map((p) => ({
      '@type': 'CreativeWork',
      '@id': new URL(p.url, siteUrl).toString(),
      name: p.title,
      url: new URL(p.url, siteUrl).toString(),
      learningResourceType: p.examType,
      dateCreated: p.year ? `${p.year}` : undefined,
    }))
  }
}
