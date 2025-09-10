import ArticleClient from './article-client'
import { Metadata } from 'next'
import { jsonLdBreadcrumb } from '@/lib/seo'
import { jsonLdSpeakable } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/news/${params.id}`, { cache: 'no-store' })
    if (!res.ok) return { title: params.id }
    const json = await res.json()
    const item = json.data
    if (!item) return { title: params.id }

    const title = item.title
    const description = item.content?.slice(0, 160) || 'CampusAxis news and announcements.'
    const canonical = `${siteUrl}/news/${params.id}`

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
            url: item.image_url ? new URL(item.image_url, siteUrl).toString() : defaultSvg,
            alt: item.title || 'CampusAxis preview',
            type: item.image_url ? undefined : 'image/svg+xml',
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
      alternates: { canonical: `/news/${params.id}` },
      robots: {
        // If the article is not published yet, avoid indexing
        index: item.status === 'published' && (!!item.published_at && new Date(item.published_at) <= new Date()),
        follow: true,
      },
    }
  } catch (e) {
    return { title: params.id }
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  // Server-side fetch to build Article JSON-LD for better SEO previews
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    // fetch server-side to include JSON-LD
    // intentionally not cached to reflect latest content
    const res = await fetch(`${siteUrl}/api/news/${params.id}`, { cache: 'no-store' })
    const json = res.ok ? await res.json() : null
    const item = json?.data || null

    const jsonLd = item
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/news/${params.id}`,
          },
          headline: item.title,
          image: item.image_url ? [new URL(item.image_url, siteUrl).toString()] : [new URL('/og-preview.png', siteUrl).toString()],
          datePublished: item.published_at || undefined,
          dateModified: item.updated_at || undefined,
          author: {
            '@type': 'Organization',
            name: 'CampusAxis',
          },
          publisher: {
            '@type': 'Organization',
            name: 'CampusAxis',
            logo: {
              '@type': 'ImageObject',
              url: new URL('/new%20logo.jpg', siteUrl).toString(),
            },
          },
        }
      : null

    const breadcrumb = jsonLdBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'News', path: '/news' },
      { name: item?.title || params.id, path: `/news/${params.id}` },
    ])

    const speakable = jsonLdSpeakable(['article h1', 'article p'])

    return (
      <>
        {jsonLd && (
          // Server-side JSON-LD injection
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb, speakable]) }}
          />
        )}
        <ArticleClient />
      </>
    )
  } catch (e) {
    return <ArticleClient />
  }
}
