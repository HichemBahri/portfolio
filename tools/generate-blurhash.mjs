import sharp from 'sharp';
import { encode } from 'blurhash';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBlurhash(imagePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`);
      return {
        blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
        width: 400,
        height: 300,
      };
    }

    const imageBuffer = await sharp(fullPath)
      .resize(32, 32, { fit: 'inside' })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = imageBuffer;
    const { width, height } = info;

    const blurhash = encode(
      new Uint8ClampedArray(data),
      width,
      height,
      4,
      4
    );

    return {
      blurhash,
      width: info.width,
      height: info.height,
    };
  } catch (error) {
    console.error(`Error generating blurhash for ${imagePath}:`, error);
    return {
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
      width: 400,
      height: 300,
    };
  }
}

async function main() {
  const projectsDataPath = path.join(process.cwd(), 'app/_data/projects-data.ts');
  const projectsData = fs.readFileSync(projectsDataPath, 'utf-8');
  
  // Extract image URLs from the projects data
  const imageUrls = new Set();
  const imageUrlRegex = /imageUrl:\s*["']([^"']+)["']/g;
  const logoRegex = /logo:\s*["']([^"']+)["']/g;
  const galleryRegex = /"([^"]*\.(jpg|jpeg|png|gif|webp))"/g;
  
  let match;
  while ((match = imageUrlRegex.exec(projectsData)) !== null) {
    imageUrls.add(match[1]);
  }
  while ((match = logoRegex.exec(projectsData)) !== null) {
    imageUrls.add(match[1]);
  }
  while ((match = galleryRegex.exec(projectsData)) !== null) {
    imageUrls.add(match[1]);
  }

  console.log('Found images:', Array.from(imageUrls));

  const blurhashData = {};
  
  for (const imageUrl of imageUrls) {
    console.log(`Generating blurhash for: ${imageUrl}`);
    const data = await generateBlurhash(imageUrl);
    blurhashData[imageUrl] = data;
  }

  // Write blurhash data to a JSON file
  const outputPath = path.join(process.cwd(), 'app/_data/blurhash-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(blurhashData, null, 2));
  
  console.log('Blurhash data generated and saved to:', outputPath);
}

main().catch(console.error);
