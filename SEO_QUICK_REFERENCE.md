# 🎯 SEO Quick Reference Card for CampusAxis

## Adding SEO to a New Page

### Step 1: Import SEO Utilities
```typescript
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { pageTemplates } from "@/lib/seo-config"
```

### Step 2: Add Metadata Export
```typescript
export const metadata: Metadata = createMetadata({
  title: "Your Page Title (50-60 chars) | CampusAxis",
  description: "Compelling description with primary keyword (150-160 chars)",
  path: "/your-page-path",
  keywords: ["primary keyword", "secondary keyword", "long-tail keyword"],
})
```

### Step 3: Add Structured Data
```typescript
export default function YourPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'Your Page', path: '/your-page' }
  ])
  
  return (
    <>
      <script type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} 
      />
      {/* Your content */}
    </>
  )
}
```

### Step 4: Content Structure
```tsx
<main>
  <h1>Primary Keyword in H1 (Only One H1 per page)</h1>
  
  <section>
    <h2>Secondary Keyword in H2</h2>
    <p>Content with natural keyword usage (2-3% density)</p>
  </section>
  
  <section>
    <h2>FAQ Section</h2>
    {/* Add FAQ schema */}
  </section>
</main>
```

---

## SEO Checklist for Every Page

### Metadata ✅
- [ ] Unique title (50-60 characters)
- [ ] Compelling description (150-160 characters)
- [ ] 5-10 relevant keywords
- [ ] Canonical URL set
- [ ] OG image (1200x630px)
- [ ] Twitter card meta tags

### Content ✅
- [ ] One H1 tag with primary keyword
- [ ] Multiple H2/H3 tags with related keywords
- [ ] 500+ words of quality content
- [ ] 3-5 internal links to related pages
- [ ] 1-2 external links to authoritative sources
- [ ] Images with descriptive alt text
- [ ] CTA (Call-to-Action) button

### Structured Data ✅
- [ ] Breadcrumb navigation (JSON-LD)
- [ ] Page-specific schema (Article, FAQPage, HowTo, etc.)
- [ ] Organization schema (site-wide)

### Performance ✅
- [ ] Images optimized (WebP format)
- [ ] Lazy loading for below-fold images
- [ ] Minified CSS/JS
- [ ] No console errors
- [ ] Mobile-responsive

---

## Target Keywords by Page Type

### GPA Calculator
- **Primary:** COMSATS GPA calculator
- **Secondary:** CGPA calculator, semester GPA
- **Long-tail:** How to calculate GPA at COMSATS

### Past Papers
- **Primary:** COMSATS past papers
- **Secondary:** Previous papers, exam papers
- **Long-tail:** Download COMSATS past papers free PDF

### Faculty Profiles
- **Primary:** COMSATS faculty reviews
- **Secondary:** Professor ratings, teacher reviews
- **Long-tail:** Best professors at COMSATS Lahore

### News/Blog
- **Primary:** COMSATS news, COMSATS guide
- **Secondary:** University updates, student tips
- **Long-tail:** How to [specific topic] at COMSATS

---

## Common Schema Templates

### FAQ Schema
```typescript
import { jsonLdFAQ } from "@/lib/seo"

const faqData = [
  { question: "Question 1?", answer: "Answer 1" },
  { question: "Question 2?", answer: "Answer 2" },
]

const faqSchema = jsonLdFAQ(faqData)
```

### HowTo Schema
```typescript
import { STRUCTURED_DATA } from "@/lib/seo"

const howToSchema = STRUCTURED_DATA.howTo(
  "How to Do Something",
  "Description of the task",
  ["Step 1", "Step 2", "Step 3"]
)
```

### Article Schema
```typescript
import { jsonLdBlogPosting } from "@/lib/seo"

const articleSchema = jsonLdBlogPosting({
  title: "Article Title",
  description: "Article description",
  slug: "article-slug",
  datePublished: "2025-01-09",
  authorName: "Author Name",
  image: "/article-image.jpg"
})
```

### Person Schema (Faculty)
```typescript
import { jsonLdPerson } from "@/lib/seo"

const personSchema = jsonLdPerson({
  name: "Dr. John Doe",
  jobTitle: "Assistant Professor",
  department: "Computer Science",
  url: "/faculty/john-doe",
  email: "john@comsats.edu.pk",
  specializations: ["AI", "Machine Learning"]
})
```

---

## Quick Tips

### ✅ DO
- Write for humans first, search engines second
- Use keywords naturally in content
- Add alt text to all images
- Link to related pages internally
- Update content regularly
- Monitor Search Console weekly

### ❌ DON'T
- Keyword stuff (>5% density)
- Use duplicate content
- Hide text (white text on white background)
- Buy backlinks
- Use generic meta descriptions
- Ignore mobile users

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| PageSpeed Desktop | >95 | 98 |
| PageSpeed Mobile | >85 | 92 |
| LCP | <2.5s | 1.8s |
| FID | <100ms | 45ms |
| CLS | <0.1 | 0.05 |

---

## Keyword Tracking

| Keyword | Current Position | Target | Status |
|---------|-----------------|--------|--------|
| COMSATS GPA calculator | - | #1 | 🎯 New |
| COMSATS past papers | - | #1-3 | 🎯 New |
| COMSATS faculty reviews | - | #1-5 | 🎯 New |

---

## Internal Linking Strategy

### High Authority Pages (Link FROM these):
- Homepage `/`
- GPA Calculator `/gpa-calculator`
- Past Papers `/past-papers`

### Link TO:
- New blog posts
- Deep pages (specific courses, faculty profiles)
- Category pages

**Example:**
```tsx
<Link href="/gpa-calculator/semester">
  Calculate your semester GPA
</Link>
```

---

## Image Optimization Quick Guide

### Formats
- **Logo/Icons:** SVG (vector, scalable)
- **Photos:** WebP (smaller size)
- **Fallback:** PNG or JPG

### Sizes
- **OG Image:** 1200x630px
- **Hero Image:** 1920x1080px
- **Thumbnail:** 400x300px
- **Icon:** 192x192, 512x512

### Alt Text Template
```tsx
<Image 
  src="/gpa-calculator-screenshot.webp"
  alt="COMSATS GPA calculator interface showing semester calculation"
  width={800}
  height={600}
  loading="lazy"
/>
```

---

## Testing Your SEO

### Before Publishing
1. **Rich Results Test:** https://search.google.com/test/rich-results
2. **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
3. **PageSpeed Insights:** https://pagespeed.web.dev/
4. **Schema Validator:** https://validator.schema.org/

### After Publishing
1. Submit to Search Console
2. Request indexing
3. Monitor for 7 days
4. Check rankings in Search Console

---

## Emergency SEO Fixes

### Page Not Ranking?
1. Check if indexed in Search Console
2. Verify canonical URL is correct
3. Increase content length (aim for 1500+ words)
4. Add more internal links
5. Build 5-10 quality backlinks

### High Bounce Rate?
1. Improve page load speed
2. Add more internal links
3. Enhance content quality
4. Improve mobile experience
5. Add engaging visuals

### Low CTR?
1. Rewrite meta title (add numbers, power words)
2. Make description more compelling
3. Add FAQ schema for rich snippets
4. Use emojis in title (if appropriate)

---

## Quick Commands

### Test Local SEO
```bash
# Check meta tags
curl http://localhost:3000/gpa-calculator | grep '<meta'

# Check structured data
curl http://localhost:3000/gpa-calculator | grep 'application/ld+json'
```

### Generate Sitemap
```bash
npm run build
# Sitemap auto-generated at /sitemap.xml
```

### Check Build Errors
```bash
npm run build
# Fix any errors before deploying
```

---

## Resources

### Documentation
- SEO Implementation Guide: `/SEO_IMPLEMENTATION_GUIDE.md`
- SEO Config: `/lib/seo-config.ts`
- SEO Utilities: `/lib/seo.ts`

### External Tools
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com
- PageSpeed Insights: https://pagespeed.web.dev

---

**Version:** 1.0  
**Last Updated:** January 2025  
**For:** CampusAxis Development Team
