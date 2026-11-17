#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public');
const outputDir = path.join(process.cwd(), 'public', 'optimized');

const sizes = {
  small: 480,
  medium: 1024,
  large: 1920,
};

async function optimizeImages() {
  try {
    console.log('🚀 Starting image optimization...');

    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Find all image files in the public directory
    const allFiles = await fs.readdir(imagesDir, { recursive: true });
    const imageFiles = allFiles.filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file.toString())
    );

    for (const file of imageFiles) {
      const inputFile = path.join(imagesDir, file.toString());
      const relativePath = path.relative(imagesDir, inputFile);
      const outputSubDir = path.dirname(path.join(outputDir, relativePath));

      // Create subdirectory in output if it doesn't exist
      await fs.mkdir(outputSubDir, { recursive: true });

      for (const [sizeName, width] of Object.entries(sizes)) {
        const outputFilename = `${path.basename(relativePath, path.extname(relativePath))}-${sizeName}.webp`;
        const outputFile = path.join(outputSubDir, outputFilename);

        console.log(`🔄 Converting: ${relativePath} -> ${path.relative(process.cwd(), outputFile)}`);

        await sharp(inputFile)
          .resize({ width })
          .webp({ quality: 80 })
          .toFile(outputFile);
      }
    }

    console.log('\n✅ Image optimization completed successfully!');
    console.log(`📁 Optimized images saved in: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error during image optimization:', error.message);
    process.exit(1);
  }
}

optimizeImages();
