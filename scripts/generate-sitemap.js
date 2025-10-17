const fs = require('fs');
const path = require('path');

// Simple sitemap generator that creates a basic sitemap.xml file
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site';

const staticPaths = [
  '/',
  '/about',
  '/contact',
  '/support',
  '/contribute',
  '/guidance',
  '/help',
  '/blog',
  '/blog/comsats-grading-system',
  '/blog/comsats-gpa-calculator-guide',
  '/news',
  '/news-events',
  '/past-papers',
  '/fee-challan-reissuance',
  '/gpa-calculator',
  '/gpa-calculator/semester',
  '/gpa-calculator/cumulative',
  '/gpa-calculator/aggregate',
  '/gpa-calculator/planning',
  '/resources',
  '/student-support',
  '/help-desk',
  '/timetable',
  '/timetables',
  '/community',
  '/faculty',
  '/faculty/reviews',
  '/privacy',
  '/terms',
  '/legal',
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/report-issue',
  '/lost-found',
  '/admissions',
  '/admissions#mentors',
  '/admissions#resources',
  '/admissions#prep',
  '/test-preparation',
  '/study-groups'
];

const generateSitemap = () => {
  const sitemapEntries = staticPaths.map(path => {
    return `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated at: ${sitemapPath}`);
};

generateSitemap();