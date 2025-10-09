const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Advanced logo vectorization and analysis
async function analyzeLogo() {
  const logoPath = path.join(__dirname, 'public', 'new-logo.jpg');
  const image = await loadImage(logoPath);
  
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const pixels = imageData.data;
  
  // Extract unique colors
  const colorMap = new Map();
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    if (a > 128) { // Only visible pixels
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }
  }
  
  // Sort by frequency
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  
  console.log('Top 20 Colors in Logo:');
  sortedColors.forEach(([color, count]) => {
    console.log(`${color}: ${count} pixels (${(count / (image.width * image.height) * 100).toFixed(2)}%)`);
  });
  
  return {
    width: image.width,
    height: image.height,
    colors: sortedColors,
    imageData: imageData
  };
}

analyzeLogo().catch(console.error);
