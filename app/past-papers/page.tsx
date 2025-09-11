import { Metadata } from 'next'
import PastPapersClient from './past-papers-client'
import { jsonLdBreadcrumb, jsonLdCollectionPage } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'COMSATS Past Papers (Midterm & Final) – Download by Course',
  description: 'Browse and download COMSATS past papers grouped by course code. Filter by semester, exam type, year, tags and department to study smarter.',
  alternates: { canonical: (process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site') + '/past-papers' },
  keywords: ['COMSATS past papers','COMSATS midterm papers','COMSATS final term papers','course past papers','COMSATS exams'],
  openGraph: {
    title: 'COMSATS Past Papers (Midterm & Final) – Download by Course',
    description: 'Filter and download COMSATS past papers by course code, exam type and semester.',
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site') + '/past-papers'
  },
  twitter: {
    title: 'COMSATS Past Papers – Course Archive',
    description: 'Download COMSATS midterm & final papers by course code with smart filtering.'
  }
}

export default function PastPapersPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Past Papers', path: '/past-papers' },
  ])
  const collection = jsonLdCollectionPage({
    name: 'COMSATS Past Papers',
    description: 'Structured archive of COMSATS University past papers (midterm, final, quizzes, assignments) with filtering.',
    path: '/past-papers'
  })
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, collection]) }} />
      <PastPapersClient />
    </>
  )
}
