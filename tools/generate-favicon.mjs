#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputSvg = path.join(process.cwd(), 'public', 'logo.svg');
const outputIco = path.join(process.cwd(), 'public', 'logo.ico');

async function generateFavicon() {
  try {
    console.log('🎨 Converting SVG to ICO...');
    
    // Read the SVG file
    const svgBuffer = fs.readFileSync(inputSvg);
    
    // Convert SVG to ICO with multiple sizes and transparent background
    await sharp(svgBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(outputIco);
    
    console.log('✅ Favicon generated successfully!');
    console.log(`📁 Output: ${outputIco}`);
    
    // Also generate additional sizes for better browser support
    const sizes = [16, 32, 48];
    
    for (const size of sizes) {
      const outputPath = path.join(process.cwd(), 'public', `favicon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`📁 Generated: favicon-${size}x${size}.png`);
    }
    
    console.log('\n🎉 All favicon files generated with transparent backgrounds!');
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
    process.exit(1);
  }
}

generateFavicon();
