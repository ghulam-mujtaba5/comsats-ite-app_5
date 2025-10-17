/**
 * RSS Feed for CampusAxis Blog
 * Generates an RSS 2.0 feed for all published blog posts
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  try {
    // Fetch blog posts from your API
    const response = await fetch(`${siteUrl}/api/blog`, {
      cache: 'no-store',
      next: { revalidate: 3600 },
    })

    let posts: any[] = []
    
    if (response.ok) {
      const data = await response.json()
      posts = data.data || []
    }

    // Generate RSS feed
    const rss = generateRSS(posts, siteUrl)

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}

function generateRSS(posts: any[], siteUrl: string): string {
  const now = new Date().toUTCString()

  const items = posts
    .filter((post) => post.status === 'published' || post.status === 'PUBLISHED')
    .slice(0, 50) // Limit to 50 most recent posts
    .map((post) => {
      const pubDate = post.published_at || post.created_at
      const description = post.excerpt || post.summary || ''
      const content = post.content || ''
      
      return `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${siteUrl}/blog/${post.slug || post.id}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug || post.id}</guid>
      <description><![CDATA[${escapeXml(description)}]]></description>
      <content:encoded><![CDATA[${escapeXml(content)}]]></content:encoded>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ''}
      ${post.image_url ? `<enclosure url="${siteUrl}${post.image_url}" type="image/jpeg" />` : ''}
      ${post.tags ? post.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ') : ''}
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CampusAxis Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Latest news, tips, and guides for COMSATS University students</description>
    <language>en-PK</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>CampusAxis</title>
      <link>${siteUrl}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} CampusAxis. All rights reserved.</copyright>
    <category>Education</category>
    <category>University</category>
    <category>Student Resources</category>
${items}
  </channel>
</rss>`
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
