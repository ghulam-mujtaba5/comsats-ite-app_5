import CourseClient from './course-client'
import { Metadata } from 'next'

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

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'CampusAxis',
        images: course.image_url ? [new URL(course.image_url, siteUrl).toString()] : [new URL('/og-preview.png', siteUrl).toString()],
      },
      alternates: { canonical: `/past-papers/${encodeURIComponent(params.courseCode)}` },
    }
  } catch (e) {
    return { title: params.courseCode }
  }
}

export default function Page({ params }: { params: { courseCode: string } }) {
  return <CourseClient params={params} />
}
