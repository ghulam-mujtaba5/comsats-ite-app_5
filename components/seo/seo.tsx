import React from 'react'
import Head from 'next/head'
import { canonicalizePath } from '@/lib/seo'

/**
 * Reusable SEO component for pages that don't (yet) leverage the Next.js 13+ metadata export.
 * Prefer the route-level `export const metadata` when possible; this <SEO /> is a bridge for
 * client components or dynamic data scenarios (e.g., fetched content needing runtime tags).
 */
export type SEOProps = {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  image?: string
  noindex?: boolean
  ogType?: string
  children?: React.ReactNode
  canonicalOverride?: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
const defaultImage = `${siteUrl}/og-preview.png`

export function SEO(props: SEOProps) {
  const canonical = props.canonicalOverride || canonicalizePath(props.path || '/')
  const title = props.title ? `${props.title} | CampusAxis` : 'CampusAxis - COMSATS University Student Portal'
  const description = props.description || 'CampusAxis helps COMSATS students with past papers, GPA calculator, fee challan guide, scholarships and academic resources.'
  const image = props.image || defaultImage
  const keywords = props.keywords?.join(', ')

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {props.noindex && <meta name="robots" content="noindex,nofollow" />}
      {/* Open Graph */}
      <meta property="og:type" content={props.ogType || 'website'} />
      <meta property="og:site_name" content="CampusAxis" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@CampusAxis" />
      {props.children}
    </Head>
  )
}
