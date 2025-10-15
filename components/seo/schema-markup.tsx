/**
 * 🎯 Schema.org Structured Data Components
 * 
 * These components add JSON-LD structured data to pages
 * to help Google understand content and show rich results
 */

import { organizationSchema, websiteSchema } from '@/lib/seo-config'

// Organization Schema - Add to root layout
export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema)
      }}
    />
  )
}

// Website Schema - Add to root layout
export function WebsiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema)
      }}
    />
  )
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Faculty Profile Schema (Person + EducationalOccupationalCredential)
export function FacultyProfileSchema({ faculty }: {
  faculty: {
    id: string
    name: string
    title?: string
    department?: string
    email?: string
    specialization?: string[]
    education?: any[]
    averageRating?: number
    totalReviews?: number
    profileImage?: string
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": faculty.name,
    "jobTitle": faculty.title,
    "affiliation": {
      "@type": "EducationalOrganization",
      "name": "COMSATS University Islamabad, Lahore Campus",
      "department": {
        "@type": "Organization",
        "name": faculty.department
      }
    },
    "email": faculty.email,
    "knowsAbout": faculty.specialization,
    "image": faculty.profileImage,
    ...(faculty.averageRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": faculty.averageRating,
        "reviewCount": faculty.totalReviews || 0,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    "url": `https://campusaxis.site/faculty/${faculty.id}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Blog Post Schema (Article)
export function BlogPostSchema({ post }: {
  post: {
    title: string
    excerpt?: string
    content?: string
    author?: string
    publishedAt?: string
    updatedAt?: string
    image?: string
    tags?: string[]
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author || "CampusAxis Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CampusAxis",
      "logo": {
        "@type": "ImageObject",
        "url": "https://campusaxis.site/Campus Axis 1.svg"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "keywords": post.tags?.join(', '),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://campusaxis.site/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// FAQ Schema
export function FAQSchema({ faqs }: {
  faqs: { question: string; answer: string }[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Course Schema
export function CourseSchema({ course }: {
  course: {
    name: string
    code: string
    description?: string
    department?: string
    creditHours?: number
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${course.code} - ${course.name}`,
    "description": course.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "COMSATS University Islamabad",
      "department": {
        "@type": "Organization",
        "name": course.department
      }
    },
    "courseCode": course.code,
    ...(course.creditHours && {
      "educationalCredentialAwarded": `${course.creditHours} Credit Hours`
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Review Schema
export function ReviewSchema({ review }: {
  review: {
    author: string
    rating: number
    reviewBody: string
    datePublished: string
    itemReviewed: {
      type: string
      name: string
    }
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished,
    "itemReviewed": {
      "@type": review.itemReviewed.type,
      "name": review.itemReviewed.name
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Software Application Schema (for GPA Calculator)
export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "COMSATS GPA Calculator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PKR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "Free online GPA and CGPA calculator for COMSATS University students. Calculate your semester GPA and cumulative CGPA instantly with accurate results.",
    "screenshot": "https://campusaxis.site/og-preview.png",
    "featureList": [
      "Semester GPA calculation",
      "Cumulative CGPA calculation",
      "Credit hours support",
      "Latest grading scale",
      "Mobile responsive",
      "Instant results"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// News Article Schema
export function NewsArticleSchema({ article }: {
  article: {
    headline: string
    description?: string
    image?: string
    datePublished?: string
    dateModified?: string
    author?: string
  }
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.headline,
    "description": article.description,
    "image": article.image,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": article.author || "CampusAxis Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CampusAxis",
      "logo": {
        "@type": "ImageObject",
        "url": "https://campusaxis.site/Campus Axis 1.svg"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Search Results Page Schema
export function SearchResultsPageSchema({ query, results }: {
  query: string
  results: Array<{ name: string; url: string; description?: string }>
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Search results for "${query}"`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": results.map((result, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Thing",
          "name": result.name,
          "url": result.url,
          "description": result.description
        }
      }))
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}
