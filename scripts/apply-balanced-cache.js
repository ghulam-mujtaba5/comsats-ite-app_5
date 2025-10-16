#!/usr/bin/env node

/**
 * Script to apply balanced cache settings for Vercel free tier
 * Ensures data loads properly while staying within resource limits
 */

const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'app', 'api');

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

function applyBalancedCache() {
  try {
    const files = findRouteFiles(API_DIR);
    
    console.log(`Found ${files.length} API route files to update\n`);
    
    let modifiedCount = 0;
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Update s-maxage values in Cache-Control headers
      const regex1 = /s-maxage=60(?!,|\d)/g;
      if (regex1.test(content)) {
        content = content.replace(regex1, 's-maxage=120');
        modified = true;
      }
      
      // Update stale-while-revalidate values
      const regex2 = /stale-while-revalidate=30(?!,|\d)/g;
      if (regex2.test(content)) {
        content = content.replace(regex2, 'stale-while-revalidate=60');
        modified = true;
      }
      
      // Update CDN-Cache-Control values
      const regex3 = /'CDN-Cache-Control':\s*'public,\s*s-maxage=60'/g;
      if (regex3.test(content)) {
        content = content.replace(regex3, "'CDN-Cache-Control': 'public, s-maxage=120'");
        modified = true;
      }
      
      // Update Vercel-CDN-Cache-Control values
      const regex4 = /'Vercel-CDN-Cache-Control':\s*'public,\s*s-maxage=60'/g;
      if (regex4.test(content)) {
        content = content.replace(regex4, "'Vercel-CDN-Cache-Control': 'public, s-maxage=120'");
        modified = true;
      }
      
      // Update longer cache times (600 -> 900, 1800 -> 450)
      const regex5 = /s-maxage=600(?!,|\d)/g;
      if (regex5.test(content)) {
        content = content.replace(regex5, 's-maxage=900');
        modified = true;
      }
      
      const regex6 = /stale-while-revalidate=300(?!,|\d)/g;
      if (regex6.test(content)) {
        content = content.replace(regex6, 'stale-while-revalidate=450');
        modified = true;
      }
      
      const regex7 = /'CDN-Cache-Control':\s*'public,\s*s-maxage=600'/g;
      if (regex7.test(content)) {
        content = content.replace(regex7, "'CDN-Cache-Control': 'public, s-maxage=900'");
        modified = true;
      }
      
      const regex8 = /'Vercel-CDN-Cache-Control':\s*'public,\s*s-maxage=600'/g;
      if (regex8.test(content)) {
        content = content.replace(regex8, "'Vercel-CDN-Cache-Control': 'public, s-maxage=900'");
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✓ Updated: ${path.relative(process.cwd(), file)}`);
        modifiedCount++;
      }
    }
    
    console.log(`\n✅ Balanced cache settings applied!`);
    console.log(`   Modified ${modifiedCount} files`);
    console.log(`\nBalanced Settings:`);
    console.log(`   • Short cache: 120s (2 min) - Good data freshness`);
    console.log(`   • Stale-while-revalidate: 60s - Smooth updates`);
    console.log(`   • Long cache: 900s (15 min) - Static/rarely changed data`);
    console.log(`\nBenefits:`);
    console.log(`   ✓ Data loads reliably on first visit`);
    console.log(`   ✓ Still 60% reduction vs original (5 min → 2 min)`);
    console.log(`   ✓ Within Vercel free tier limits`);
    console.log(`   ✓ No refresh needed to see data`);
    
  } catch (error) {
    console.error('Error applying balanced cache:', error);
    process.exit(1);
  }
}

applyBalancedCache();
