import CourseClient from './course-client'
import { Metadata } from 'next'
import { jsonLdBreadcrumb } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { courseCode: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/past-papers/${params.courseCode}`, { cache: 'no-store' })
    if (!res.ok) return { title: params.courseCode }
    const json = await res.json()
    const course = json.data
    if (!course) return { title: params.courseCode }

    const title = `${course.name} (${course.code}) — Past Papers | CampusAxis`
    const description = course.description || `${course.name} past papers, quizzes, and exams. Download or preview PDFs for study and revision.`
    const canonical = `${siteUrl}/past-papers/${encodeURIComponent(params.courseCode)}`

    const defaultSvg = new URL('/og-preview.svg', siteUrl).toString()
    const defaultPng = new URL('/og-preview.png', siteUrl).toString()
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'CampusAxis',
        images: [
          {
            url: course.image_url ? new URL(course.image_url, siteUrl).toString() : defaultSvg,
            alt: course.name || 'CampusAxis course preview',
            type: course.image_url ? undefined : 'image/svg+xml',
            width: 1200,
            height: 630,
          },
          {
            url: defaultPng,
            alt: 'CampusAxis preview (png)',
            type: 'image/png',
            width: 1200,
            height: 630,
          },
        ],
      },
      alternates: { canonical: `/past-papers/${encodeURIComponent(params.courseCode)}` },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (e) {
    return { title: params.courseCode }
  }
}

export default async function Page({ params }: { params: { courseCode: string } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/past-papers/${params.courseCode}`, { cache: 'no-store' })
    const json = res.ok ? await res.json() : null
    const course = json?.data || null

    const jsonLd = course
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.name,
          description: course.description,
          provider: {
            '@type': 'CollegeOrUniversity',
            name: 'COMSATS University Islamabad',
            url: siteUrl,
          },
        }
      : null

    const breadcrumb = jsonLdBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Past Papers', path: '/past-papers' },
      { name: course?.name || params.courseCode, path: `/past-papers/${encodeURIComponent(params.courseCode)}` },
    ])

    return (
      <>
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }} />
        )}
        <CourseClient params={params} />
      </>
    )
  } catch (e) {
    return <CourseClient params={params} />
  }
}
