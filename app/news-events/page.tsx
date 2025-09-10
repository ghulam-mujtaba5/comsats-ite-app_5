import { Metadata } from 'next'
import { NewsEventsClient } from './news-events-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000'
  return {
    title: 'Campus News & Events',
    description: 'Browse the latest campus news, announcements, academic deadlines, and upcoming events.',
    alternates: { canonical: '/news-events' },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/news-events`,
      title: 'Campus News & Events',
      description: 'Stay updated with campus announcements and upcoming events.',
      images: [{ url: new URL('/og-preview.png', siteUrl).toString(), width: 1200, height: 630, alt: 'CampusAxis News & Events' }],
    },
    twitter: { card: 'summary_large_image', title: 'Campus News & Events', description: 'Latest campus announcements and event calendar.' },
  }
}

export default function NewsEventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Campus News & Events",
            "description": "Browse the latest campus news, announcements, academic deadlines, and upcoming events.",
            "url": `${process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000'}/news-events`,
            "mainEntity": {
              "@type": "NewsMediaOrganization",
              "name": "CampusAxis News",
              "description": "Campus news and event announcements"
            }
          })
        }}
      />
      <NewsEventsClient />
    </>
  )
}
