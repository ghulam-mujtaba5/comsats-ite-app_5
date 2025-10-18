import type { Faculty } from "./faculty-data"
import { createMetadata } from "./seo"

// Generate optimized metadata for faculty profiles
export function generateFacultyMetadata(faculty: Faculty) {
  const title = `${faculty.name} - ${faculty.title || 'Faculty'} | ${faculty.department} | CampusAxis`
  const description = `View profile, courses, and student reviews for ${faculty.name}${
    faculty.title ? `, ${faculty.title}` : ''
  } in the ${faculty.department} department at COMSATS University Islamabad. ${
    faculty.totalReviews > 0 
      ? `Rated ${faculty.averageRating.toFixed(1)}/5 by ${faculty.totalReviews} students.` 
      : 'Check out student reviews and ratings.'
  }`
  
  const keywords = [
    faculty.name,
    faculty.department,
    'COMSATS faculty',
    'faculty profile',
    'student reviews',
    'professor',
    ...faculty.specialization,
    ...faculty.courses.slice(0, 3) // Limit to first 3 courses to avoid keyword stuffing
  ]

  return createMetadata({
    title,
    description,
    path: `/faculty/${faculty.id}`,
    image: faculty.profileImage,
    keywords,
  })
}

// Generate optimized Open Graph image URL for faculty profiles
export function generateFacultyOGImageUrl(faculty: Faculty): string {
  // If faculty has a profile image, use it
  if (faculty.profileImage) {
    return faculty.profileImage
  }
  
  // Otherwise, use a default faculty image
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  return `${siteUrl}/placeholder-user.jpg`
}

// Generate faculty schema markup for rich snippets
export function generateFacultySchema(faculty: Faculty, reviews: any[] = []) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/faculty/${faculty.id}`,
    name: faculty.name,
    jobTitle: faculty.title || 'Faculty Member',
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'COMSATS University Islamabad',
      sameAs: 'https://www.comsats.edu.pk/'
    },
    department: faculty.department,
    image: generateFacultyOGImageUrl(faculty),
    url: `${siteUrl}/faculty/${faculty.id}`,
    email: faculty.email || undefined,
    telephone: faculty.phone || undefined,
    workLocation: faculty.office ? {
      '@type': 'Place',
      name: `Office ${faculty.office}`,
    } : undefined,
    knowsAbout: faculty.specialization.length > 0 ? faculty.specialization : undefined,
    teaches: faculty.courses.map(course => ({
      '@type': 'Course',
      name: course
    })),
    aggregateRating: faculty.totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: faculty.averageRating,
      reviewCount: faculty.totalReviews,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: reviews.slice(0, 10).map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.studentName
      },
      reviewBody: review.comment,
      datePublished: review.createdAt,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  }
}