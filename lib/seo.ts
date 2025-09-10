import type { Metadata } from "next"

export type CreateMetadataInput = {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noindex?: boolean
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
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
