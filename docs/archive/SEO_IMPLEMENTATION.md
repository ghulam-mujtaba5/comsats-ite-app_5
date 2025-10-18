# SEO Implementation Guide for CampusAxis

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Core SEO Features](#core-seo-features)
5. [Implementation Checklist](#implementation-checklist)
6. [Testing & Validation](#testing--validation)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Best Practices](#best-practices)
9. [Resources](#resources)

---

## Overview

This document outlines the comprehensive SEO implementation for CampusAxis. The implementation follows industry best practices and covers all aspects of technical SEO, on-page optimization, and performance.

### SEO Score Target: 95%+

Our SEO implementation includes:
- ✅ Technical SEO (robots.txt, sitemap, meta tags)
- ✅ On-page SEO (titles, descriptions, headers, keywords)
- ✅ Structured Data (JSON-LD schemas)
- ✅ Performance Optimization (Core Web Vitals)
- ✅ Mobile Optimization
- ✅ Accessibility
- ✅ Analytics & Monitoring

---

## Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

**Required Variables:**
```env
NEXT_PUBLIC_SITE_URL=https://campusaxis.site
NEXT_PUBLIC_SITE_NAME=CampusAxis
NEXT_PUBLIC_SITE_TITLE=CampusAxis - COMSATS University Islamabad
```

**Optional but Recommended:**
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_verification_code
NEXT_PUBLIC_BING_WEBMASTER_VERIFICATION=your_verification_code
NEXT_PUBLIC_TWITTER_HANDLE=@CampusAxis
```

### 2. Run SEO Audit

```bash
node scripts/seo-audit.js
```

This will check your SEO implementation and provide recommendations.

### 3. Build and Deploy

```bash
pnpm build
pnpm start
```

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your website's URL | `https://campusaxis.site` |
| `NEXT_PUBLIC_SITE_NAME` | Site name | `CampusAxis` |
| `NEXT_PUBLIC_SITE_TITLE` | Default page title | `CampusAxis - COMSATS University` |

### Analytics & Tracking

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | [Google Analytics](https://analytics.google.com) |
| `NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION` | Search Console verification | [Google Search Console](https://search.google.com/search-console) |
| `NEXT_PUBLIC_BING_WEBMASTER_VERIFICATION` | Bing verification | [Bing Webmaster Tools](https://www.bing.com/webmasters) |

---

## Core SEO Features

### 1. Robots.txt Configuration

**Location:** `app/robots.ts`

Features:
- ✅ Sitemap reference
- ✅ Crawl delay configuration
- ✅ Bot-specific rules (Googlebot, Bingbot)
- ✅ Disallow patterns for private pages

**Access:** `https://campusaxis.site/robots.txt`

### 2. Sitemap Generation

**Location:** `app/sitemap.ts`

Features:
- ✅ Dynamic sitemap generation
- ✅ Change frequency configuration
- ✅ Priority settings
- ✅ Last modified dates
- ✅ Image sitemap support

**Access:** `https://campusaxis.site/sitemap.xml`

### 3. Meta Tags

**Location:** `app/layout.tsx`

Global meta tags include:
- ✅ Title template
- ✅ Description
- ✅ Keywords
- ✅ Robots directives
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Viewport optimization
- ✅ Theme color
- ✅ Icons and manifest

### 4. Structured Data (JSON-LD)

**Location:** `lib/seo-utils.ts`, `components/seo/seo-head.tsx`

Available schemas:
- Organization
- WebSite
- Breadcrumb
- Article
- Course
- FAQ
- Person (for faculty profiles)

### 5. RSS Feed

**Location:** `app/feed.xml/route.ts`

**Access:** `https://campusaxis.site/feed.xml`

Features:
- ✅ Blog posts feed
- ✅ Auto-updates with new content
- ✅ Proper RSS 2.0 format
- ✅ Image enclosures

---

## Implementation Checklist

### ✅ Project Setup

- [x] Configure robots.txt
- [x] Create and verify sitemap.xml
- [x] Add canonical URLs
- [x] Set NEXT_PUBLIC_SITE_URL in .env
- [x] Enable HTTPS (Vercel handles this)

### ✅ Meta Tags & Head Elements

- [x] Set unique `<title>` for each page
- [x] Add `<meta name="description">` for all routes
- [x] Add `<meta name="keywords">`
- [x] Include `<meta name="robots">`
- [x] Add `<link rel="canonical">`
- [x] Add favicon and manifest links
- [x] Include Open Graph meta tags
- [x] Add Twitter Card tags

### ✅ URL & Routing Structure

- [x] Use clean, readable URLs
- [x] Use dynamic routes for SEO pages
- [x] Ensure canonical URLs
- [x] Avoid duplicate content
- [x] Redirect trailing slashes

### ✅ Performance & Core Web Vitals

- [x] Optimize images using next/image
- [x] Enable Image Optimization
- [x] Implement lazy loading
- [x] Use static generation (SSG) where possible
- [x] Enable incremental static regeneration (ISR)
- [x] Minimize unused JavaScript
- [x] Use CDN (Vercel)
- [x] Track Core Web Vitals

### ✅ Content Optimization

- [x] Keyword-rich content structure
- [x] Proper heading hierarchy (H1, H2, H3)
- [x] Internal linking strategy
- [x] Semantic HTML
- [x] Alt text for images

### ✅ Schema & Structured Data

- [x] Organization schema
- [x] WebSite schema with search action
- [x] Breadcrumb schema
- [x] Article schema for blog posts
- [x] Course schema for academic content
- [x] FAQ schema
- [x] Person schema for faculty profiles

### ✅ Mobile Optimization

- [x] Responsive design
- [x] Viewport meta tag
- [x] Touch-friendly UI
- [x] Mobile-first approach

### ✅ Technical SEO

- [x] Generated sitemap
- [x] Custom 404 page
- [x] Proper redirects
- [x] Analytics tracking
- [x] Canonical tags

### ✅ Accessibility & Usability

- [x] Alt text for images
- [x] Proper color contrast
- [x] Keyboard navigation
- [x] ARIA attributes
- [x] Descriptive link text

### ✅ Monitoring & Tools

- [x] Google Analytics integration
- [x] Web Vitals tracking
- [x] Performance monitoring
- [x] Error tracking

### ✅ Bonus Features

- [x] next/script for third-party scripts
- [x] Prefetch with next/link
- [x] Dynamic OG images
- [x] RSS feed for blog
- [x] SEO audit script

---

## Testing & Validation

### Local Testing

1. **Run SEO Audit:**
   ```bash
   node scripts/seo-audit.js
   ```

2. **Build and Test:**
   ```bash
   pnpm build
   pnpm start
   ```

3. **Check robots.txt:**
   Visit: `http://localhost:3000/robots.txt`

4. **Check sitemap:**
   Visit: `http://localhost:3000/sitemap.xml`

5. **Check RSS feed:**
   Visit: `http://localhost:3000/feed.xml`

### Online Testing Tools

1. **Google Lighthouse**
   - Chrome DevTools > Lighthouse
   - Run audit for Performance, SEO, Accessibility

2. **Google Search Console**
   - [Search Console](https://search.google.com/search-console)
   - Submit sitemap
   - Check URL inspection
   - Monitor coverage

3. **PageSpeed Insights**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - Test Core Web Vitals

4. **Rich Results Test**
   - [Rich Results Test](https://search.google.com/test/rich-results)
   - Validate structured data

5. **Mobile-Friendly Test**
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

6. **Schema Markup Validator**
   - [Schema.org Validator](https://validator.schema.org/)

---

## Monitoring & Analytics

### Google Analytics 4 (GA4)

**Setup:**

1. Create GA4 property at [Google Analytics](https://analytics.google.com)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

**Available Tracking:**

The implementation includes tracking for:
- Page views
- Custom events
- Search queries
- Downloads
- Outbound links
- Form submissions
- Video interactions
- Core Web Vitals
- User engagement
- Errors

**Usage Example:**

```typescript
import { event, trackSearch, trackDownload } from '@/lib/monitoring'

// Track custom event
event({
  action: 'button_click',
  category: 'Engagement',
  label: 'Download Past Paper',
})

// Track search
trackSearch('data structures', 42)

// Track download
trackDownload('CS101-Midterm-2024.pdf', 'PDF')
```

### Google Search Console

**Setup:**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership using meta tag verification
4. Add verification code to `.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION=your_code_here
   ```

**Submit Sitemap:**

1. In Search Console, go to Sitemaps
2. Submit: `https://campusaxis.site/sitemap.xml`

### Web Vitals Monitoring

Core Web Vitals are automatically tracked and sent to Google Analytics:

- **LCP** (Largest Contentful Paint) - Loading performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability

**View in GA4:**
Events > Web Vitals

---

## Best Practices

### Page-Level SEO

For each page, use the `generateSEOMetadata` helper:

```typescript
import { generateSEOMetadata } from '@/lib/seo-utils'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Past Papers - COMSATS University',
  description: 'Download past exam papers for all courses at COMSATS University...',
  keywords: ['past papers', 'COMSATS', 'exams', 'study material'],
  canonical: '/past-papers',
  ogImage: '/images/past-papers-og.png',
})
```

### Structured Data

Add structured data to pages:

```typescript
import { ArticleSchema } from '@/components/seo/seo-head'

export default function BlogPost() {
  return (
    <>
      <ArticleSchema
        headline="Complete Guide to COMSATS GPA Calculator"
        description="Learn how to calculate your GPA..."
        image="/images/gpa-calculator.png"
        datePublished="2025-01-01T00:00:00Z"
        author="CampusAxis Team"
        url="/blog/gpa-calculator-guide"
      />
      {/* Page content */}
    </>
  )
}
```

### Image Optimization

Always use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/images/campus.jpg"
  alt="COMSATS University Islamabad Campus"
  width={1200}
  height={630}
  priority // For above-the-fold images
  loading="lazy" // For below-the-fold images
/>
```

### Internal Linking

Use descriptive anchor text:

```tsx
// ❌ Bad
<Link href="/past-papers">Click here</Link>

// ✅ Good
<Link href="/past-papers">Download Past Exam Papers</Link>
```

### Heading Hierarchy

Maintain proper heading structure:

```tsx
// ✅ Correct hierarchy
<h1>Main Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>
```

---

## Common SEO Tasks

### Adding a New Page

1. **Create the page file** (e.g., `app/new-page/page.tsx`)

2. **Add metadata:**
   ```typescript
   export const metadata: Metadata = generateSEOMetadata({
     title: 'Page Title',
     description: 'Page description...',
     canonical: '/new-page',
   })
   ```

3. **Update sitemap** if needed (`app/sitemap.ts`)

4. **Add internal links** from related pages

5. **Run audit:**
   ```bash
   node scripts/seo-audit.js
   ```

### Updating Meta Tags

Global meta tags are in `app/layout.tsx`. Page-specific meta tags should be in each page's `metadata` export.

### Adding Structured Data

Use the helpers from `components/seo/seo-head.tsx`:

```typescript
import { FAQSchema } from '@/components/seo/seo-head'

const faqItems = [
  {
    question: 'How do I calculate my GPA?',
    answer: 'Use our GPA calculator...',
  },
]

<FAQSchema items={faqItems} />
```

---

## Troubleshooting

### Sitemap Not Generating

1. Check `app/sitemap.ts` exists
2. Verify `NEXT_PUBLIC_SITE_URL` is set
3. Build the app: `pnpm build`
4. Check `/sitemap.xml` in production

### Meta Tags Not Showing

1. Verify metadata export in page file
2. Check `metadataBase` in `app/layout.tsx`
3. Clear browser cache
4. Use "View Page Source" to verify HTML

### Images Not Optimized

1. Use `next/image` component
2. Check `next.config.mjs` image configuration
3. Verify image paths
4. Check image formats (WebP preferred)

### Analytics Not Tracking

1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Check GA4 script in `app/layout.tsx`
3. Test in production (not localhost)
4. Check browser console for errors

---

## Resources

### Official Documentation

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

### Tools

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [Rich Results Test](https://search.google.com/test/rich-results)

### Learning Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Web.dev Learn SEO](https://web.dev/learn/seo/)

---

## Maintenance

### Monthly Tasks

- [ ] Check Google Search Console for errors
- [ ] Review Google Analytics metrics
- [ ] Test Core Web Vitals
- [ ] Update sitemap if needed
- [ ] Check for broken links
- [ ] Review and update meta descriptions

### Quarterly Tasks

- [ ] Run full SEO audit
- [ ] Update structured data
- [ ] Review and update keywords
- [ ] Analyze competitor SEO
- [ ] Update content for freshness

### Yearly Tasks

- [ ] Complete SEO strategy review
- [ ] Update all meta tags
- [ ] Refresh all structured data
- [ ] Review and update all content
- [ ] Audit and update internal linking

---

## Contact & Support

For SEO-related questions or issues:
- Email: support@campusaxis.site
- Documentation: This file
- SEO Audit: Run `node scripts/seo-audit.js`

---

**Last Updated:** October 18, 2025  
**Version:** 1.0.0  
**Maintained by:** CampusAxis Team
