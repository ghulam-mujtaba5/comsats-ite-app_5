// Script to analyze image optimization opportunities
const fs = require('fs');
const path = require('path');

// Function to get image files and their sizes
function getImages(dirPath) {
  const images = [];
  try {
    function walkDir(currentPath) {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
          walkDir(itemPath);
        } else {
          const ext = path.extname(item).toLowerCase();
          if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
            images.push({
              path: itemPath,
              relativePath: itemPath.replace(dirPath, ''),
              ext,
              size: stats.size,
              name: item
            });
          }
        }
      }
    }
    walkDir(dirPath);
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
  return images;
}

// Function to format bytes to human readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to suggest optimizations
function suggestOptimizations(images) {
  const suggestions = [];
  let totalOriginalSize = 0;
  let totalPotentialSavings = 0;
  
  for (const image of images) {
    totalOriginalSize += image.size;
    
    // Check for large images
    if (image.size > 500 * 1024) { // 500KB
      suggestions.push({
        type: 'large_image',
        image: image.relativePath,
        size: image.size,
        suggestion: `Large image (${formatBytes(image.size)}). Consider compressing or using WebP format.`
      });
    }
    
    // Check for PNG images that might be better as WebP
    if (image.ext === '.png' && image.size > 100 * 1024) { // 100KB
      suggestions.push({
        type: 'png_to_webp',
        image: image.relativePath,
        size: image.size,
        suggestion: `PNG image (${formatBytes(image.size)}). Consider converting to WebP for better compression.`
      });
    }
    
    // Check for JPEG images that might be better as WebP
    if ((image.ext === '.jpg' || image.ext === '.jpeg') && image.size > 100 * 1024) { // 100KB
      suggestions.push({
        type: 'jpeg_to_webp',
        image: image.relativePath,
        size: image.size,
        suggestion: `JPEG image (${formatBytes(image.size)}). Consider converting to WebP for better compression.`
      });
    }
    
    // Estimate potential savings (rough estimate)
    let savings = 0;
    if (image.ext === '.png') {
      savings = image.size * 0.4; // Rough estimate of PNG compression savings
    } else if (image.ext === '.jpg' || image.ext === '.jpeg') {
      savings = image.size * 0.3; // Rough estimate of JPEG compression savings
    }
    totalPotentialSavings += savings;
  }
  
  return {
    suggestions,
    totalOriginalSize,
    totalPotentialSavings
  };
}

// Analyze images in public directory
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  console.log('=== IMAGE OPTIMIZATION ANALYSIS ===\n');
  
  const images = getImages(publicDir);
  console.log(`Found ${images.length} images in public directory.\n`);
  
  // Sort images by size (largest first)
  images.sort((a, b) => b.size - a.size);
  
  console.log('Largest Images:');
  console.log('===============');
  for (let i = 0; i < Math.min(10, images.length); i++) {
    const image = images[i];
    console.log(`${image.relativePath.padEnd(40)} ${formatBytes(image.size).padStart(10)}`);
  }
  
  console.log('\nOptimization Suggestions:');
  console.log('========================');
  
  const { suggestions, totalOriginalSize, totalPotentialSavings } = suggestOptimizations(images);
  
  if (suggestions.length === 0) {
    console.log('No major optimization opportunities found.');
  } else {
    for (const suggestion of suggestions) {
      console.log(`• ${suggestion.suggestion}`);
    }
  }
  
  console.log(`\nTotal Image Size: ${formatBytes(totalOriginalSize)}`);
  console.log(`Potential Savings: ${formatBytes(totalPotentialSavings)} (${((totalPotentialSavings / totalOriginalSize) * 100).toFixed(1)}%)`);
  
  console.log('\n=== ANALYSIS COMPLETE ===');
} else {
  console.log('Public directory not found.');
}