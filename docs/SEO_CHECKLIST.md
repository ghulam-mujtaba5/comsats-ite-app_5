# SEO Checklist for CampusAxis

## ✅ Quick Setup Checklist

### 1. Environment Configuration (5 minutes)
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://campusaxis.site`
- [ ] Set `NEXT_PUBLIC_SITE_NAME=CampusAxis`
- [ ] Set `NEXT_PUBLIC_SITE_TITLE=CampusAxis - COMSATS University Islamabad`
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (if you have Google Analytics)
- [ ] Set `NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION` (after verifying in GSC)
- [ ] Set `NEXT_PUBLIC_BING_WEBMASTER_VERIFICATION` (after verifying in Bing)

### 2. Verify SEO Files (2 minutes)
- [x] `app/robots.ts` exists
- [x] `app/sitemap.ts` exists
- [x] `app/feed.xml/route.ts` exists (RSS feed)
- [x] `app/not-found.tsx` exists (Custom 404)
- [x] `lib/seo-utils.ts` exists
- [x] `components/seo/seo-head.tsx` exists

### 3. Run SEO Audit (1 minute)
```bash
pnpm seo:audit
```
Or:
```bash
node scripts/seo-audit.js
```

### 4. Test Locally (5 minutes)
```bash
pnpm build
pnpm start
```

Then check:
- [ ] Visit http://localhost:3000/robots.txt
- [ ] Visit http://localhost:3000/sitemap.xml
- [ ] Visit http://localhost:3000/feed.xml
- [ ] Visit http://localhost:3000/non-existent-page (should show custom 404)
- [ ] Check View Source for meta tags on homepage

### 5. Deploy & Verify (10 minutes)

Deploy to Vercel/hosting platform, then:

- [ ] Visit https://campusaxis.site/robots.txt
- [ ] Visit https://campusaxis.site/sitemap.xml
- [ ] Visit https://campusaxis.site/feed.xml

### 6. Submit to Search Engines (15 minutes)

#### Google Search Console
1. [ ] Go to [Google Search Console](https://search.google.com/search-console)
2. [ ] Add property: `https://campusaxis.site`
3. [ ] Verify using HTML meta tag (already added in layout.tsx)
4. [ ] Submit sitemap: `https://campusaxis.site/sitemap.xml`

#### Bing Webmaster Tools
1. [ ] Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. [ ] Add site: `https://campusaxis.site`
3. [ ] Verify using HTML meta tag (already added in layout.tsx)
4. [ ] Submit sitemap: `https://campusaxis.site/sitemap.xml`

#### Google Analytics
1. [ ] Create GA4 property at [Google Analytics](https://analytics.google.com)
2. [ ] Get Measurement ID (G-XXXXXXXXXX)
3. [ ] Add to environment variables
4. [ ] Redeploy
5. [ ] Test tracking with Real-time reports

### 7. Performance Testing (10 minutes)

Run these tests on your deployed site:

- [ ] [Google PageSpeed Insights](https://pagespeed.web.dev/)
  - Target: 90+ for Performance, SEO, Accessibility
  
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)
  - Test homepage and a few key pages
  
- [ ] [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
  
- [ ] [Schema Markup Validator](https://validator.schema.org/)
  - Paste your site URL and validate

### 8. Monitor & Maintain (Ongoing)

#### Weekly
- [ ] Check Google Search Console for errors
- [ ] Review Google Analytics for traffic insights

#### Monthly
- [ ] Run SEO audit: `pnpm seo:audit`
- [ ] Check Core Web Vitals in GSC
- [ ] Review and update meta descriptions if needed
- [ ] Check for broken links

#### Quarterly
- [ ] Full SEO review
- [ ] Update keywords based on search trends
- [ ] Refresh content for popular pages

---

## 🎯 SEO Score Targets

| Metric | Target | Tool |
|--------|--------|------|
| **Performance** | 90+ | PageSpeed Insights |
| **SEO Score** | 95+ | PageSpeed Insights |
| **Accessibility** | 95+ | PageSpeed Insights |
| **Best Practices** | 95+ | PageSpeed Insights |
| **Core Web Vitals** | Good | Search Console |
| **Mobile Usability** | 0 errors | Search Console |
| **Index Coverage** | 100% valid | Search Console |

---

## 📊 Key Metrics to Track

### Google Analytics
- [ ] Page views
- [ ] Bounce rate (<40% target)
- [ ] Average session duration (>2 min target)
- [ ] Pages per session (>3 target)
- [ ] Top landing pages
- [ ] Top search queries (from GSC)

### Google Search Console
- [ ] Total clicks
- [ ] Total impressions
- [ ] Average CTR (>3% target)
- [ ] Average position (<10 target)
- [ ] Core Web Vitals (all "Good")
- [ ] Mobile usability (0 errors)

---

## 🚀 Quick Wins

Already implemented for you:

✅ **Technical SEO**
- Robots.txt configured
- XML sitemap auto-generated
- Clean URLs with redirects
- Canonical URLs on all pages
- 404 page optimized
- HTTPS (via Vercel)

✅ **On-Page SEO**
- Meta titles on all pages
- Meta descriptions on all pages
- Robots meta tags
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Semantic HTML
- Image optimization (next/image)

✅ **Performance**
- Static generation (SSG)
- Image optimization
- Code splitting
- Lazy loading
- CDN (Vercel)
- Web Vitals tracking

✅ **Content**
- RSS feed for blog
- Breadcrumbs with schema
- Alt text for images
- Proper heading hierarchy
- Internal linking

✅ **Tools & Monitoring**
- Google Analytics integration
- Web Vitals tracking
- Error tracking
- SEO audit script
- Performance monitoring

---

## 📝 Next Steps

To further improve SEO:

1. **Create quality content regularly**
   - Blog posts (weekly)
   - Update past papers (as available)
   - Add faculty reviews (user-generated)

2. **Build backlinks**
   - Submit to university directories
   - Partner with student organizations
   - Create shareable resources

3. **Optimize for keywords**
   - Research keywords with Google Keyword Planner
   - Update content based on search trends
   - Target long-tail keywords

4. **Improve user engagement**
   - Add interactive features
   - Improve page load times
   - Make content easy to share

5. **Monitor and iterate**
   - Review analytics monthly
   - Run A/B tests
   - Update based on user feedback

---

## 🆘 Troubleshooting

### Issue: Sitemap not accessible
**Solution:** 
- Build the project: `pnpm build`
- Restart server: `pnpm start`
- Check `NEXT_PUBLIC_SITE_URL` is set

### Issue: Meta tags not showing
**Solution:**
- Clear browser cache
- View Page Source (not Inspect Element)
- Check metadata export in page file

### Issue: Analytics not tracking
**Solution:**
- Verify GA_MEASUREMENT_ID is correct
- Check in production (not localhost)
- Wait 24-48 hours for data to appear
- Use Real-time reports for immediate testing

### Issue: Search Console shows errors
**Solution:**
- Use URL Inspection tool
- Check error details
- Fix and request re-indexing

---

## 📚 Resources

- [Complete SEO Guide](./SEO_IMPLEMENTATION.md)
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Last Updated:** October 18, 2025  
**Status:** ✅ All SEO features implemented and ready to use
