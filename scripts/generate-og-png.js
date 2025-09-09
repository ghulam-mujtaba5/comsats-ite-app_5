const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const svgPath = path.resolve(__dirname, '../public/og-preview.svg')
const outPath = path.resolve(__dirname, '../public/og-preview.png')

async function generate() {
  if (!fs.existsSync(svgPath)) {
    console.error('SVG not found at', svgPath)
    process.exit(1)
  }

  const svg = fs.readFileSync(svgPath)
  try {
    await sharp(svg)
      .resize(1200, 630, { fit: 'cover' })
      .png({ quality: 90 })
      .toFile(outPath)
    console.log('Generated', outPath)
  } catch (e) {
    console.error('Failed to generate PNG', e)
    process.exit(2)
  }
}

generate()
