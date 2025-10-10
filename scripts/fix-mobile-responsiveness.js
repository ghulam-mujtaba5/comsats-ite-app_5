// Script to fix mobile responsiveness issues
const fs = require('fs');
const path = require('path');

// Pages that need fixes
const pagesToFix = [
  'app/contact/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/auth/page.tsx',
  'app/auth/reset-password/page.tsx',
  'app/past-papers/page.tsx',
  'app/past-papers/[courseCode]/page.tsx',
  'app/news/[id]/page.tsx',
  'app/news-events/page.tsx',
  'app/community/post/[id]/page.tsx',
  'app/community/profile/page.tsx',
  'app/community/search/page.tsx',
  'app/student-support/page.tsx',
  'app/help/page.tsx',
  'app/search/page.tsx',
  'app/admin/community/page.tsx'
];

// Function to fix a file
function fixFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = false;
    
    // Fix missing container/max-width
    if (filePath !== 'app/auth/reset-password/page.tsx' && 
        filePath !== 'app/community/profile/page.tsx' && 
        filePath !== 'app/community/search/page.tsx') {
      // Add container class to main div if not present
      if (!content.includes('container') && !content.includes('max-w-')) {
        content = content.replace(/<main[^>]*>/, '<main className="container mx-auto px-4 py-8 max-w-7xl">');
        content = content.replace(/<div[^>]*>/, '<div className="container mx-auto px-4 py-8 max-w-7xl">');
        changesMade = true;
      }
    }
    
    // Fix small touch targets for specific pages
    if (filePath === 'app/auth/reset-password/page.tsx' || 
        filePath === 'app/community/profile/page.tsx' || 
        filePath === 'app/community/search/page.tsx') {
      // Look for small buttons and increase their size
      content = content.replace(/h-(\d+)/g, (match, p1) => {
        const size = parseInt(p1);
        if (size < 10) {
          return `h-10`;
        }
        return match;
      });
      
      content = content.replace(/w-(\d+)/g, (match, p1) => {
        const size = parseInt(p1);
        if (size < 10) {
          return `w-10`;
        }
        return match;
      });
      
      changesMade = true;
    }
    
    // Write the fixed content back to the file
    if (changesMade) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed mobile responsiveness issues in: ${filePath}`);
      return true;
    } else {
      console.log(`No changes needed for: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

// Fix all pages
let fixedCount = 0;
for (const pagePath of pagesToFix) {
  if (fixFile(pagePath)) {
    fixedCount++;
  }
}

console.log(`\n=== MOBILE RESPONSIVENESS FIXES COMPLETE ===`);
console.log(`Fixed ${fixedCount} pages`);
console.log(`=== FIXES COMPLETE ===`);