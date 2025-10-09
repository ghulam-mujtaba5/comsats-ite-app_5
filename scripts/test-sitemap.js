const fs = require('fs');

// Simple script to verify sitemap structure
async function testSitemap() {
  try {
    // Import the sitemap function
    const { default: sitemap } = await import('../app/sitemap.ts');
    
    // Generate the sitemap
    const entries = await sitemap();
    
    console.log(`Generated sitemap with ${entries.length} entries`);
    
    // Check for any invalid entries
    const invalidEntries = entries.filter(entry => {
      if (!entry.url) {
        console.log('Entry missing URL:', entry);
        return true;
      }
      
      try {
        new URL(entry.url);
      } catch (e) {
        console.log('Invalid URL:', entry.url);
        return true;
      }
      
      return false;
    });
    
    if (invalidEntries.length > 0) {
      console.log(`Found ${invalidEntries.length} invalid entries`);
      return false;
    }
    
    console.log('Sitemap validation passed!');
    return true;
  } catch (error) {
    console.error('Sitemap test failed:', error);
    return false;
  }
}

testSitemap().then(success => {
  process.exit(success ? 0 : 1);
});