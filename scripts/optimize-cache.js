#!/usr/bin/env node

/**
 * Script to optimize cache headers in API routes for Vercel free tier
 * Reduces excessive caching that causes resource utilization issues
 */

const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

// Updated cache configurations optimized for free tier
const CACHE_CONFIGS = {
  // Reduce from 5 minutes to 1 minute
  'public, s-maxage=300, stale-while-revalidate=150': 'public, s-maxage=60, stale-while-revalidate=30',
  "CDN-Cache-Control': 'public, s-maxage=300": "CDN-Cache-Control': 'public, s-maxage=60",
  "Vercel-CDN-Cache-Control': 'public, s-maxage=300": "Vercel-CDN-Cache-Control': 'public, s-maxage=60",
  
  // Reduce from 1 hour to 10 minutes
  'public, s-maxage=3600, stale-while-revalidate=1800': 'public, s-maxage=600, stale-while-revalidate=300',
  "CDN-Cache-Control': 'public, s-maxage=3600": "CDN-Cache-Control': 'public, s-maxage=600",
  "Vercel-CDN-Cache-Control': 'public, s-maxage=3600": "Vercel-CDN-Cache-Control': 'public, s-maxage=600",
  
  // Update comments to reflect new times
  '// Cache for 5 minutes, stale for 2.5 min': '// Cache for 1 minute, stale for 30 sec (optimized for free tier)',
  '// Cache for 1 hour, stale for 30 min': '// Cache for 10 minutes, stale for 5 min (optimized for free tier)',
};

function findRouteFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findRouteFiles(filePath, fileList);
    } else if (file === 'route.ts') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function optimizeApiCache() {
  try {
    // Find all route.ts files in app/api
    const files = findRouteFiles(API_DIR);
    
    console.log(`Found ${files.length} API route files to optimize\n`);
    
    let modifiedCount = 0;
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      for (const [oldValue, newValue] of Object.entries(CACHE_CONFIGS)) {
        if (content.includes(oldValue)) {
          content = content.replaceAll(oldValue, newValue);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✓ Optimized: ${path.relative(process.cwd(), file)}`);
        modifiedCount++;
      }
    }
    
    console.log(`\n✅ Cache optimization complete!`);
    console.log(`   Modified ${modifiedCount} files`);
    console.log(`\nOptimizations applied:`);
    console.log(`   • Reduced s-maxage from 300s (5min) to 60s (1min)`);
    console.log(`   • Reduced stale-while-revalidate from 150s to 30s`);
    console.log(`   • Reduced long cache from 3600s (1hr) to 600s (10min)`);
    console.log(`\nThis will significantly reduce resource usage on Vercel free tier.`);
    
  } catch (error) {
    console.error('Error optimizing cache:', error);
    process.exit(1);
  }
}

optimizeApiCache();
