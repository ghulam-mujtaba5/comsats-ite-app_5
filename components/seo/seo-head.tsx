/**
 * SEO Head Component
 * Reusable component for consistent SEO across all pages
 */

import Script from 'next/script'

interface SEOHeadProps {
  structuredData?: Record<string, any> | Record<string, any>[]
}

export function SEOHead({ structuredData }: SEOHeadProps) {
  const renderStructuredData = () => {
    if (!structuredData) return null

    const data = Array.isArray(structuredData) ? structuredData : [structuredData]

    return data.map((item, index) => (
      <Script
        key={`structured-data-${index}`}
        id={`structured-data-${index}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        strategy="beforeInteractive"
      />
    ))
  }

  return <>{renderStructuredData()}</>
}

/**
 * Breadcrumb Component with Schema
 */
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="beforeInteractive"
      />
    </>
  )
}

/**
 * Article Schema Component
 */
interface ArticleSchemaProps {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}

export function ArticleSchema(props: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.headline,
    description: props.description,
    image: `${siteUrl}${props.image}`,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    author: {
      '@type': 'Person',
      name: props.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CampusAxis',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${props.url}`,
    },
  }

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * FAQ Schema Component
 */
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FAQItem[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * Course Schema Component
 */
interface CourseSchemaProps {
  name: string
  description: string
  provider: string
  url: string
}

export function CourseSchema(props: CourseSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: props.name,
    description: props.description,
    provider: {
      '@type': 'Organization',
      name: props.provider,
      url: siteUrl,
    },
    url: `${siteUrl}${props.url}`,
  }

  return (
    <Script
      id="course-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * Person Schema Component (for faculty profiles)
 */
interface PersonSchemaProps {
  name: string
  jobTitle?: string
  url: string
  image?: string
  description?: string
}

export function PersonSchema(props: PersonSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: props.name,
    jobTitle: props.jobTitle,
    url: `${siteUrl}${props.url}`,
    image: props.image ? `${siteUrl}${props.image}` : undefined,
    description: props.description,
  }

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="beforeInteractive"
    />
  )
}
