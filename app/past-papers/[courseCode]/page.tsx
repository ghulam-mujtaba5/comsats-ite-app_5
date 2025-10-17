import CourseClient from './course-client'
import "../past-papers.light.module.css"
import "../past-papers.dark.module.css"
import { Metadata } from 'next'
import { jsonLdBreadcrumb, jsonLdCourseWithPapers } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ courseCode: string }> }): Promise<Metadata> {
  const { courseCode } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  try {
    const res = await fetch(`${siteUrl}/api/past-papers/${courseCode}`, { cache: 'no-store' })
    if (!res.ok) return { title: courseCode }
    const json = await res.json()
    const course = json.data
    if (!course) return { title: courseCode }

    const title = `${course.name} (${course.code}) — Past Papers | CampusAxis`
    const description = course.description || `${course.name} past papers, quizzes, and exams. Download or preview PDFs for study and revision.`
    const canonical = `${siteUrl}/past-papers/${encodeURIComponent(courseCode)}`

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
      alternates: { canonical: `/past-papers/${encodeURIComponent(courseCode)}` },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (e) {
    const { courseCode } = await params
    return { title: courseCode }
  }
}

export default async function Page({ params }: { params: Promise<{ courseCode: string }> }) {
  const { courseCode } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  try {
    const res = await fetch(`${siteUrl}/api/past-papers/${courseCode}`, { cache: 'no-store' })
    const json = res.ok ? await res.json() : null
    const course = json?.data || null

    // Build hasPart list from aggregated paper sets if present
    const papers: Array<{ id: string; title: string; url: string; examType?: string; year?: number }> = []
    if (course) {
      ;['assignments','quizzes','midterms','finals'].forEach(bucket => {
        const arr = (course as any)[bucket]
        if (Array.isArray(arr)) {
          arr.forEach((p: any) => papers.push({
            id: p.id || p.paper_id || `${bucket}-${Math.random().toString(36).slice(2,8)}`,
            title: p.title || `${course.name} ${bucket}`,
            url: `/past-papers/${encodeURIComponent(course.code)}`,
            examType: bucket.slice(0,-1),
            year: p.year || (p.created_at ? new Date(p.created_at).getFullYear() : undefined)
          }))
        }
      })
    }

    const jsonLd = course ? jsonLdCourseWithPapers({
      courseCode: course.code,
      courseName: course.name,
      path: `/past-papers/${encodeURIComponent(courseCode)}`,
      papers
    }) : null

    const breadcrumb = jsonLdBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Past Papers', path: '/past-papers' },
      { name: course?.name || courseCode, path: `/past-papers/${encodeURIComponent(courseCode)}` },
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
