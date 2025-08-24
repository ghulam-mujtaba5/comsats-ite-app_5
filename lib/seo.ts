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
    logo: `${siteUrl}/placeholder-logo.png`,
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
