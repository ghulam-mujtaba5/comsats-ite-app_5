import ArticleClient from './article-client'
import { Metadata } from 'next'

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

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'CampusAxis',
        images: item.image_url ? [new URL(item.image_url, siteUrl).toString()] : [new URL('/og-preview.png', siteUrl).toString()],
      },
      alternates: { canonical: `/news/${params.id}` },
    }
  } catch (e) {
    return { title: params.id }
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <ArticleClient />
}
