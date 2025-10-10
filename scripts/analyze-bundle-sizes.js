// Script to analyze bundle sizes
const fs = require('fs');
const path = require('path');

// Function to get directory size recursively
function getDirectorySize(dirPath) {
  let size = 0;
  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        size += getDirectorySize(itemPath);
      } else {
        size += stats.size;
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
  return size;
}

// Function to format bytes to human readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analyze key directories
const directories = [
  'app',
  'components',
  'lib',
  'public',
  'styles',
  'hooks',
  'contexts'
];

console.log('=== BUNDLE SIZE ANALYSIS ===\n');

let totalSize = 0;
const dirSizes = [];

for (const dir of directories) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    const size = getDirectorySize(dirPath);
    totalSize += size;
    dirSizes.push({ dir, size });
  }
}

// Sort by size (largest first)
dirSizes.sort((a, b) => b.size - a.size);

console.log('Directory Sizes:');
console.log('================');
for (const { dir, size } of dirSizes) {
  console.log(`${dir.padEnd(15)} ${formatBytes(size).padStart(10)}`);
}

console.log('\nTotal Project Size:');
console.log('===================');
console.log(formatBytes(totalSize));

// Analyze public directory for assets
console.log('\n=== ASSET ANALYSIS ===\n');

const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  const assets = [];
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        walkDir(itemPath);
      } else {
        const ext = path.extname(item).toLowerCase();
        const size = stats.size;
        assets.push({ path: itemPath.replace(publicDir, ''), ext, size });
      }
    }
  }
  
  walkDir(publicDir);
  
  // Group by extension
  const extGroups = {};
  for (const asset of assets) {
    if (!extGroups[asset.ext]) {
      extGroups[asset.ext] = { count: 0, size: 0 };
    }
    extGroups[asset.ext].count++;
    extGroups[asset.ext].size += asset.size;
  }
  
  console.log('Asset Types:');
  console.log('============');
  const extEntries = Object.entries(extGroups);
  extEntries.sort((a, b) => b[1].size - a[1].size);
  
  for (const [ext, data] of extEntries) {
    console.log(`${ext.padEnd(8)} ${data.count.toString().padStart(4)} files ${formatBytes(data.size).padStart(10)}`);
  }
  
  // Find largest assets
  console.log('\nLargest Assets:');
  console.log('===============');
  assets.sort((a, b) => b.size - a.size);
  for (let i = 0; i < Math.min(10, assets.length); i++) {
    const asset = assets[i];
    console.log(`${asset.path.padEnd(40)} ${formatBytes(asset.size).padStart(10)}`);
  }
}

console.log('\n=== ANALYSIS COMPLETE ===');