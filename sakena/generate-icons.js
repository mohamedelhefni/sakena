#!/usr/bin/env node

/**
 * Icon Generator Script
 * Converts SVG to PNG icons in various sizes for PWA
 * 
 * To use this script:
 * 1. Install dependencies: npm install sharp
 * 2. Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available (for production use)
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Install with: npm install sharp');
  console.log('Falling back to manual instructions...');
}

const sizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

const iconDir = path.join(__dirname, 'public', 'icons');
const svgPath = path.join(iconDir, 'icon.svg');

async function generateIcons() {
  if (!sharp) {
    console.log('\n📱 Manual Icon Generation Instructions:');
    console.log('=====================================');
    console.log('Since Sharp is not installed, please generate icons manually:');
    console.log('\n1. Open the SVG file: public/icons/icon.svg');
    console.log('2. Use one of these tools:');
    console.log('   - Online: https://realfavicongenerator.net/');
    console.log('   - Online: https://favicon.io/favicon-converter/');
    console.log('   - Desktop: Figma, Adobe Illustrator, or Inkscape');
    console.log('\n3. Generate these sizes:');
    sizes.forEach(({ size, name }) => {
      console.log(`   - ${name} (${size}x${size})`);
    });
    console.log('\n4. Save all files to: public/icons/');
    console.log('\n✨ The heart SVG is ready at: public/icons/icon.svg');
    return;
  }

  try {
    console.log('🎨 Generating PWA icons from heart SVG...');
    
    if (!fs.existsSync(svgPath)) {
      throw new Error('SVG file not found at: ' + svgPath);
    }

    const svgBuffer = fs.readFileSync(svgPath);
    
    for (const { size, name } of sizes) {
      const outputPath = path.join(iconDir, name);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`✅ Generated: ${name}`);
    }
    
    // Generate favicon.ico (multiple sizes in one file)
    const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    
    console.log('✅ Generated: favicon.png (rename to favicon.ico if needed)');
    console.log('\n🎉 All PWA icons generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('\n📝 Please generate icons manually using the instructions above.');
  }
}

// Alternative: Create data URLs for immediate use
function createDataURLs() {
  console.log('\n📋 Heart Icon Data URLs:');
  console.log('========================');
  
  const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#16a34a"/>
        <stop offset="100%" style="stop-color:#3b82f6"/>
      </linearGradient>
    </defs>
    <path d="M256 448l-32-29.6C102.4 306.4 32 241.6 32 160c0-53.6 43.2-96 96-96 28.8 0 56 12.8 76.8 33.6L256 149.6l51.2-52C328 76.8 355.2 64 384 64c52.8 0 96 42.4 96 96 0 81.6-70.4 146.4-192 258.4L256 448z" fill="url(#hg)"/>
  </svg>`;
  
  const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(heartSvg).toString('base64');
  console.log('Favicon data URL:');
  console.log(dataUrl);
}

if (require.main === module) {
  generateIcons();
  createDataURLs();
}

module.exports = { generateIcons };
