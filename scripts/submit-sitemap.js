#!/usr/bin/env node

/**
 * Sitemap Submission Script
 * 
 * This script helps submit the sitemap to Google Search Console
 * to improve indexing of the CampusAxis admissions module.
 */

const https = require('https');
const { execSync } = require('child_process');

// Configuration
const SITE_URL = 'https://campusaxis.site';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// Google Search Console API endpoint for sitemap submission
// Note: This requires proper authentication which is complex to set up
// For now, we'll provide instructions for manual submission

async function submitSitemap() {
  console.log('🔍 CampusAxis Sitemap Submission Tool');
  console.log('=====================================\n');
  
  console.log('📋 Checking sitemap accessibility...');
  
  try {
    // Check if sitemap is accessible
    const sitemapCheck = await new Promise((resolve, reject) => {
      https.get(SITEMAP_URL, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          reject(new Error(`Sitemap returned status ${res.statusCode}`));
        }
      }).on('error', reject);
    });
    
    if (sitemapCheck) {
      console.log('✅ Sitemap is accessible at:', SITEMAP_URL);
    }
  } catch (error) {
    console.error('❌ Error checking sitemap:', error.message);
    console.log('\nPlease ensure your Next.js application is running and the sitemap is accessible.');
    return;
  }
  
  console.log('\n📝 To submit your sitemap to Google Search Console:');
  console.log('1. Go to https://search.google.com/search-console');
  console.log('2. Sign in with your Google account');
  console.log('3. Select your property (https://campusaxis.site)');
  console.log('4. Navigate to "Sitemaps" in the left sidebar');
  console.log('5. Enter your sitemap URL:', SITEMAP_URL);
  console.log('6. Click "Submit"');
  
  console.log('\n🚀 Additional SEO Recommendations:');
  console.log('- Share your homepage and project links on LinkedIn, GitHub, and Twitter');
  console.log('- Add internal links between related pages');
  console.log('- Ensure all pages have unique meta titles and descriptions');
  console.log('- Add canonical URLs to prevent duplicate content issues');
  
  console.log('\n⏰ Note:');
  console.log('If your domain is new (less than 2 months old), Google may take 3-4 weeks');
  console.log('to fully crawl and index your content even after submission.');
  
  // Try to open Google Search Console in browser (if possible)
  try {
    console.log('\n🌐 Opening Google Search Console...');
    execSync('start https://search.google.com/search-console', { stdio: 'ignore' });
  } catch (error) {
    // Ignore errors - opening browser is optional
  }
}

// Run the script
submitSitemap().catch(console.error);