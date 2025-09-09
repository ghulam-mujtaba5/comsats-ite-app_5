SEO Checklist for CampusAxis

This checklist gathers the recommended SEO and social sharing configuration for the CampusAxis project deployed to Vercel and using Supabase for auth.

1) Environment variables (Vercel project settings)
- NEXT_PUBLIC_SITE_URL=https://campusaxis.site
- NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
- NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
- SUPABASE_SERVICE_ROLE_KEY=<service-role-key> (server-only)
- NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token> (optional — for Search Console)
- NEXT_PUBLIC_GA_MEASUREMENT_ID=<GA4 id> (optional)
- NEXT_PUBLIC_GTM_ID=<GTM id> (optional)

Set these on the Production environment in Vercel. Use Preview/Development envs for non-prod values (localhost or preview domains).

2) Vercel domains & canonical
- Add and verify these domains in Vercel: campusaxis.site and www.campusaxis.site
- Decide canonical domain (recommended: campusaxis.site) and configure Vercel to redirect www -> non-www if desired.
- Ensure NEXT_PUBLIC_SITE_URL uses your canonical domain exactly (no trailing slash recommended).

3) Supabase Auth config
- Authentication -> URL Configuration in Supabase:
  - Site URL: https://campusaxis.site
  - Redirect URLs (add):
    - https://campusaxis.site/auth/callback
    - http://localhost:3000/auth/callback (dev)
    - https://<your-vercel-preview>.vercel.app/auth/callback (if using previews)
- If using social providers, configure provider-specific redirect URIs in the provider consoles (Google/Github). Supabase docs list the exact callback URL (usually https://<project-ref>.supabase.co/auth/v1/callback).

4) Sitemap & robots
- Sitemap is available at: https://campusaxis.site/sitemap.xml (generated from `app/sitemap.ts`)
- Robots file points to the sitemap in production (`app/robots.ts`).
- In Google Search Console / Bing Webmaster Tools, submit the sitemap URL.

5) Metadata & Open Graph
- Metadata base is taken from NEXT_PUBLIC_SITE_URL (see `app/layout.tsx` and `lib/seo.ts`).
- Ensure Open Graph images are absolute URLs and sized 1200x630 for best sharing. The project uses `/university-faculty-workshop.png`.
- Recommended: create a dedicated social preview image 1200x630 in `public/`.

6) Structured data
- JSON-LD for Website and Organization is included in `app/layout.tsx` using `jsonLdWebSite()` and `jsonLdOrganization()` from `lib/seo.ts`.

7) Verification & indexing
- Add and verify campusaxis.site in Google Search Console (use DNS or meta tag verification). If using meta tag verification, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel with the provided value.
- After verification, submit sitemap and request indexing for important pages.

8) Monitoring & testing
- Use the Facebook/Twitter card validators to preview social share cards:
  - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
  - Twitter Card Validator: https://cards-dev.twitter.com/validator
- Check mobile performance and SEO with PageSpeed Insights: https://developers.google.com/speed/pagespeed/insights/

9) Optional improvements
- Add og:image:width and og:image:height (done) and multiple image sizes.
- Localize metadata and add more hreflang entries if you target multiple languages.
- Add sitemap entries for dynamic content (news, blog, past-papers) if you can compute them server-side and include last-modified timestamps.


How to verify quickly locally
- Start the dev server: `pnpm dev` or `npm run dev` (depends on your scripts)
- Visit `http://localhost:3000/auth/callback?code=123&type=signup` to confirm the callback route exists (it will redirect).


If you want, I can:
- Generate a 1200x630 social-preview image and add it to `public/` (small, designed sample)
- Add meta tags for Twitter/X Player, `og:video` if you want video previews
- Wire a small sitemap generation for dynamic content (news/past-papers) to include lastModified

10) Scripts & middleware (added to repo)
- Generate PNG from the SVG social preview (uses `sharp`):
  - `node scripts/generate-og-png.js` — reads `public/og-preview.svg` and writes `public/og-preview.png` (1200x630)
- Notify search engines (ping sitemap):
  - `node scripts/notify-search-engines.js` — reads `NEXT_PUBLIC_SITE_URL` and pings Google & Bing with your sitemap URL.
- Canonicalization middleware:
  - `middleware.ts` redirects non-canonical hostnames (e.g., `www.`) to the host in `NEXT_PUBLIC_SITE_URL` and enforces HTTPS in production. Deploy with `NEXT_PUBLIC_SITE_URL` set to the canonical domain.

Run these locally (PowerShell):
```powershell
# generate PNG from SVG
node scripts/generate-og-png.js

# ping Google & Bing (make sure NEXT_PUBLIC_SITE_URL is set in env)
$env:NEXT_PUBLIC_SITE_URL='https://campusaxis.site'
node scripts/notify-search-engines.js
```

11) Automation & structured data
- JSON-LD: article and course pages now include JSON-LD (NewsArticle / Course) injected server-side for better rich results.
- HSTS: global HSTS header is applied via `next.config.mjs` (production recommended).
- Automatic sitemap ping: a GitHub Actions workflow (`.github/workflows/seo-ping.yml`) is provided to ping search engines when code is pushed to `main`. Set the repository secret `SITE_URL` to `https://campusaxis.site` in GitHub.

Deployment checklist (quick):
1. Add `NEXT_PUBLIC_SITE_URL=https://campusaxis.site` to Vercel (Production env).
2. Add Supabase redirect URLs (including `/auth/callback`) in the Supabase Console.
3. Add GitHub secret `SITE_URL` with the canonical site URL if you want automated pings on `main`.
4. Deploy; verify sitemap at `https://campusaxis.site/sitemap.xml` and run social card validators.

12) Continuous SEO checks
- A GitHub Actions workflow (`.github/workflows/seo-audit.yml`) can run Lighthouse SEO audits against the `SITE_URL` secret. Add `SITE_URL` to repository secrets (https://campusaxis.site) and trigger the workflow manually or on pushes to `main` to get an HTML report artifact.


