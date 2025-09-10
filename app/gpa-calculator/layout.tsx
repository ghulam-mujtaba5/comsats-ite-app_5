import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: 'GPA Calculator — CampusAxis',
    description: 'COMSATS GPA calculators: semester GPA, CGPA, aggregate, and GPA planning with COMSATS grading scale.',
    path: '/gpa-calculator',
    keywords: ['COMSATS GPA','GPA calculator','CGPA','aggregate','grading scale','CampusAxis']
  })
}

export default function GPALayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  const webAppJson = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'COMSATS GPA Calculator Suite',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    url: `${siteUrl}/gpa-calculator`,
    featureList: [
      'Semester GPA calculator',
      'Cumulative CGPA calculator',
      'Admission aggregate calculator',
      'Future GPA planning',
      'What-if scenario modeling'
    ],
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }
  }
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJson) }} />
      {children}
    </>
  )
}
