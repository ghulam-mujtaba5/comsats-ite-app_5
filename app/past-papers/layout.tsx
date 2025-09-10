import type { Metadata } from 'next'
import { jsonLdCollectionPage, createMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: 'Past Papers — CampusAxis',
    description: 'Browse and download organized past papers: assignments, quizzes, midterms, and finals.',
    path: '/past-papers',
    keywords: ['past papers', 'COMSATS', 'quizzes', 'midterm', 'final', 'CampusAxis']
  })
}

export default function PastPapersLayout({ children }: { children: React.ReactNode }) {
  const ld = jsonLdCollectionPage({
    name: 'Past Papers',
    description: 'Directory of courses with available past exam papers, assignments, quizzes, mid-terms, and finals.',
    path: '/past-papers'
  })
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {children}
    </>
  )
}
