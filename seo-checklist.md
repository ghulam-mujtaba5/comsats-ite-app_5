# 🔍 SEO Checklist for Campus Axis (Next.js Project)

A comprehensive SEO checklist to optimize your Next.js SaaS/web application for search engines.

---

## 🏗️ 1. Project Setup

- [ ] Install `next-seo` or set up custom `<Head>` component for meta tags
- [ ] Configure a **robots.txt** file
- [ ] Create and verify a **sitemap.xml** (use `next-sitemap`)
- [ ] Add canonical URLs
- [ ] Ensure `.env` file has the correct `NEXT_PUBLIC_SITE_URL`
- [ ] Enable HTTPS (use Vercel or SSL on hosting)

---

## 📄 2. Meta Tags & Head Elements

- [ ] Set unique `<title>` for each page
- [ ] Add `<meta name="description">` for all routes
- [ ] Add `<meta name="keywords">` (optional but useful)
- [ ] Include `<meta name="robots" content="index,follow">`
- [ ] Add `<link rel="canonical" href="...">`
- [ ] Add favicon and manifest links in `_document.js`
- [ ] Include Open Graph (OG) meta tags for social sharing
- [ ] Add Twitter Card tags

---

## 🔗 3. URL & Routing Structure

- [ ] Use clean, readable URLs (no query parameters for core content)
- [ ] Use dynamic routes wisely (`[slug].js`) for SEO pages
- [ ] Ensure each page is accessible by one canonical URL
- [ ] Avoid duplicate content pages

---

## ⚡ 4. Performance & Core Web Vitals

- [ ] Optimize images using `next/image`
- [ ] Enable `Image Optimization` (automatic in Next.js)
- [ ] Implement lazy loading for images and heavy sections
- [ ] Use static generation (SSG) for public pages via `getStaticProps`
- [ ] Enable incremental static regeneration (ISR)
- [ ] Minimize unused JavaScript
- [ ] Use CDN (Vercel or Cloudflare)
- [ ] Measure Core Web Vitals in Lighthouse or PageSpeed Insights

---

## 🧠 5. Content Optimization

- [ ] Add keyword-rich content for each page
- [ ] Use `<h1>` once per page; include target keyword
- [ ] Use `<h2>`, `<h3>` hierarchy properly
- [ ] Include internal links between related pages
- [ ] Add external authoritative links where relevant
- [ ] Use semantic HTML (`<article>`, `<section>`, `<aside>`, `<nav>`)
- [ ] Optimize for Featured Snippets (Q&A, structured text)

---

## 🧩 6. Schema & Structured Data

- [ ] Add JSON-LD structured data for organization (`type: Organization`)
- [ ] Add BreadcrumbList schema
- [ ] Add Product / Course / Article schema if relevant
- [ ] Validate structured data with Google Rich Results Test

---

## 📱 7. Mobile Optimization

- [ ] Use responsive design (Next.js is responsive by default)
- [ ] Test layout on multiple screen sizes
- [ ] Use `viewport` meta tag correctly
- [ ] Ensure tap targets are properly sized

---

## 🔍 8. Technical SEO

- [ ] Generate and submit sitemap to Google Search Console
- [ ] Submit robots.txt in Search Console
- [ ] Ensure no broken links (use `npm run lint` or link checker)
- [ ] Add custom 404 page (`pages/404.js`)
- [ ] Use `hreflang` if multi-language support
- [ ] Redirect old URLs properly using `next.config.js` redirects
- [ ] Add analytics tracking (Google Analytics or similar)
- [ ] Add canonical meta tags dynamically for dynamic routes

---

## 🧰 9. Accessibility & Usability

- [ ] Add alt text to all images
- [ ] Ensure proper color contrast (use Lighthouse check)
- [ ] Ensure keyboard navigability
- [ ] Use ARIA attributes if needed
- [ ] Use descriptive link text (`Read more` → `Read more about Campus Axis features`)

---

## 📈 10. Monitoring & Tools

- [ ] Add Google Search Console
- [ ] Add Google Analytics / GA4
- [ ] Add Bing Webmaster Tools
- [ ] Use Lighthouse audits regularly
- [ ] Track keyword rankings
- [ ] Monitor site performance (PageSpeed Insights, GTmetrix)
- [ ] Monitor uptime using UptimeRobot or similar

---

## 🪄 11. Bonus Advanced SEO

- [ ] Use `next/script` to load third-party scripts asynchronously
- [ ] Prefetch internal links using `next/link`
- [ ] Use `og:image` and `twitter:image` dynamically
- [ ] Cache headers with `getServerSideProps` or middleware
- [ ] Add RSS feed if you have a blog
- [ ] Implement lazy hydration for heavy components

---

## 📝 Notes for Campus Axis Implementation

1. **Dynamic Content**: For user-generated content (faculty reviews, past papers), ensure proper meta tags are generated dynamically
2. **Campus-Specific Pages**: Implement location-based schema markup for different campuses
3. **Academic Resources**: Use structured data for educational resources to appear in academic search results
4. **Performance**: Leverage ISR for frequently updated content like news or events
5. **Mobile-First**: Prioritize mobile experience as most students will access via mobile devices

---

*This checklist should be reviewed and updated regularly as SEO best practices evolve.*