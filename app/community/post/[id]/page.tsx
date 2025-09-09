import { Metadata } from 'next'
import PostClient from './post-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/community/posts/${params.id}`, { cache: 'no-store' })
    if (!res.ok) return { title: `Community Post ${params.id}` }
    const json = await res.json()
    const post = json.data
    if (!post) return { title: `Community Post ${params.id}` }
    const contentSnippet = (post.content || '').replace(/\s+/g, ' ').slice(0, 160)
    const title = (post.content || 'Community Post').split('\n')[0].slice(0, 60) + (post.content?.length > 60 ? '…' : '')
    const canonical = `${siteUrl}/community/post/${params.id}`
    const defaultSvg = new URL('/og-preview.svg', siteUrl).toString()
    const defaultPng = new URL('/og-preview.png', siteUrl).toString()
    return {
      title,
      description: contentSnippet || 'Student discussion on CampusAxis community.',
      alternates: { canonical: `/community/post/${params.id}` },
      openGraph: {
        title,
        description: contentSnippet || 'Student discussion on CampusAxis community.',
        url: canonical,
        siteName: 'CampusAxis',
        type: 'article',
        images: [
          { url: defaultSvg, alt: 'CampusAxis community discussion', type: 'image/svg+xml', width: 1200, height: 630 },
          { url: defaultPng, alt: 'CampusAxis community discussion (png)', type: 'image/png', width: 1200, height: 630 }
        ],
      },
      twitter: { card: 'summary_large_image', title, description: contentSnippet || 'Student discussion on CampusAxis community.', images: [defaultPng] },
      robots: { index: true, follow: true },
    }
  } catch {
    return { title: `Community Post ${params.id}` }
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${siteUrl}/api/community/posts/${params.id}`, { cache: 'no-store' })
    const json = res.ok ? await res.json() : null
    const post = json?.data || null
    const jsonLd = post ? {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      '@id': `${siteUrl}/community/post/${params.id}`,
      url: `${siteUrl}/community/post/${params.id}`,
      headline: (post.content || 'Community Post').split('\n')[0].slice(0, 110),
      articleBody: post.content || '',
      datePublished: post.time || undefined,
      author: { '@type': 'Person', name: post.author || 'Anonymous' },
      interactionStatistic: [
        { '@type': 'InteractionCounter', interactionType: { '@type': 'LikeAction' }, userInteractionCount: post.likes || 0 },
        { '@type': 'InteractionCounter', interactionType: { '@type': 'CommentAction' }, userInteractionCount: post.comments || 0 }
      ],
      publisher: { '@type': 'Organization', name: 'CampusAxis' }
    } : null
    return (
      <>
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
        <PostClient />
      </>
    )
  } catch {
    return <PostClient />
  }
}
