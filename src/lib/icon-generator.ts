import { createCanvas, loadImage } from 'canvas';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Ensure the public directory exists
const publicDir = join(process.cwd(), 'public');

// Create icons directory if it doesn't exist
const iconsDir = join(publicDir, 'icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

/**
 * Generate PNG icons from SVG source
 * @param svgPath Path to the source SVG file
 * @param sizes Array of sizes to generate
 */
export async function generateIcons(svgPath: string, sizes: number[]) {
  try {
    // Load the SVG image
    const image = await loadImage(svgPath);
    
    // Generate icons for each size
    for (const size of sizes) {
      // Create canvas
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw image on canvas
      ctx.drawImage(image, 0, 0, size, size);
      
      // Convert to buffer
      const buffer = canvas.toBuffer('image/png');
      
      // Save to file
      const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
      writeFileSync(outputPath, buffer);
      
      console.log(`Generated icon: ${outputPath}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error generating icons:', error);
    return false;
  }
}

/**
 * Generate a single icon
 * @param svgPath Path to the source SVG file
 * @param size Size of the icon
 * @param outputPath Path to save the icon
 */
export async function generateIcon(svgPath: string, size: number, outputPath: string) {
  try {
    // Load the SVG image
    const image = await loadImage(svgPath);
    
    // Create canvas
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw image on canvas
    ctx.drawImage(image, 0, 0, size, size);
    
    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Save to file
    writeFileSync(outputPath, buffer);
    
    console.log(`Generated icon: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error generating icon:', error);
    return false;
  }
}