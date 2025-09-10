import type { Metadata } from "next"

export type CreateMetadataInput = {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noindex?: boolean
}

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || "http://localhost:3000"
const defaultImage = "/placeholder-7ca42.png"

export function createMetadata(input: CreateMetadataInput): Metadata {
  const url = input.path ? new URL(input.path, siteUrl).toString() : siteUrl
  const image = input.image || defaultImage

  const meta: Metadata = {
    title: { default: input.title, template: "%s | CampusAxis" },
    description: input.description,
    alternates: { canonical: input.path || "/" },
    keywords: input.keywords,
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      title: input.title,
      description: input.description,
      siteName: "CampusAxis",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
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
    logo: `${siteUrl}/new%20logo.jpg`,
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
    publisher: { '@type': 'Organization', name: 'CampusAxis', logo: { '@type': 'ImageObject', url: new URL('/new%20logo.jpg', siteUrl).toString() } },
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
