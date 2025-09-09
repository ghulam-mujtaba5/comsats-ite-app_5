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

