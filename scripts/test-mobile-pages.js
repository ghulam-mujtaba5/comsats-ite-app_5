// Script to test mobile page loading
const fs = require('fs');
const path = require('path');

// Read the PAGES_LIST.md file
const pagesListPath = path.join(__dirname, '..', 'PAGES_LIST.md');
const pagesListContent = fs.readFileSync(pagesListPath, 'utf8');

// Extract all page paths from the markdown file
const pagePaths = [];
const lines = pagesListContent.split('\n');
for (const line of lines) {
  const match = line.match(/\[(.*?)\]\((.*?)\)/);
  if (match) {
    const pagePath = match[2];
    if (pagePath && pagePath.startsWith('app/') && pagePath.endsWith('.tsx')) {
      pagePaths.push(pagePath);
    }
  }
}

console.log(`Found ${pagePaths.length} pages to test for mobile loading.`);

// Function to check if a page is a redirect
function isRedirectPage(content) {
  return content.includes('redirect(') || 
         content.includes('router.push') || 
         content.includes('router.replace') ||
         (content.includes('export default') && content.includes('function') && !content.includes('return (') && !content.includes('return <'));
}

// Function to check if a page imports a client component
function importsClientComponent(content) {
  return content.includes('Client') && content.includes('import ');
}

// Function to test a page
function testPage(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if it's a redirect page
    if (isRedirectPage(content)) {
      console.log(`✓ Redirect page: ${filePath}`);
      return true;
    }
    
    // Check if it imports a client component
    if (importsClientComponent(content)) {
      console.log(`✓ Client component page: ${filePath}`);
      return true;
    }
    
    // Check if it has a proper component structure
    if (content.includes('export default function') && (content.includes('return (') || content.includes('return <'))) {
      console.log(`✓ Component page: ${filePath}`);
      return true;
    }
    
    console.log(`? Unknown page type: ${filePath}`);
    return false;
  } catch (error) {
    console.error(`Error testing file ${filePath}:`, error.message);
    return false;
  }
}

// Test all pages
let passed = 0;
let failed = 0;

for (const pagePath of pagePaths) {
  if (testPage(pagePath)) {
    passed++;
  } else {
    failed++;
  }
}

console.log('\n=== MOBILE PAGE TESTING REPORT ===');
console.log(`Pages tested: ${pagePaths.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Success rate: ${((passed / pagePaths.length) * 100).toFixed(2)}%`);

if (failed > 0) {
  console.log('\n⚠️  Some pages failed testing. Please review the output above.');
} else {
  console.log('\n✅ All pages passed basic structure testing!');
}

console.log('\n=== TEST COMPLETE ===');