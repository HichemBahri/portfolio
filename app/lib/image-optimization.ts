import sharp from 'sharp';
import { encode } from 'blurhash';
import fs from 'fs';
import path from 'path';

export interface OptimizedImageData {
  blurhash: string;
  width: number;
  height: number;
  placeholder: string;
}

/**
 * Generate a blurhash for an image and return optimized image data
 */
export async function generateBlurhash(
  imagePath: string,
  componentX: number = 4,
  componentY: number = 4
): Promise<OptimizedImageData> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Image not found: ${fullPath}`);
    }

    // Read and process image with Sharp
    const imageBuffer = await sharp(fullPath)
      .resize(32, 32, { fit: 'inside' })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = imageBuffer;
    const { width, height } = info;

    // Generate blurhash
    const blurhash = encode(
      new Uint8ClampedArray(data),
      width,
      height,
      componentX,
      componentY
    );

    // Generate a small placeholder image
    const placeholder = await sharp(fullPath)
      .resize(20, 20, { fit: 'inside' })
      .jpeg({ quality: 20 })
      .toBuffer();

    const placeholderDataUrl = `data:image/jpeg;base64,${placeholder.toString('base64')}`;

    return {
      blurhash,
      width: info.width,
      height: info.height,
      placeholder: placeholderDataUrl,
    };
  } catch (error) {
    console.error('Error generating blurhash:', error);
    // Return fallback data
    return {
      blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
      width: 400,
      height: 300,
      placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    };
  }
}

/**
 * Optimize an image using Sharp
 */
export async function optimizeImage(
  imagePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
  } = {}
): Promise<Buffer> {
  const {
    width,
    height,
    quality = 80,
    format = 'webp'
  } = options;

  const fullPath = path.join(process.cwd(), 'public', imagePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Image not found: ${fullPath}`);
  }

  let sharpInstance = sharp(fullPath);

  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  switch (format) {
    case 'jpeg':
      return sharpInstance.jpeg({ quality }).toBuffer();
    case 'png':
      return sharpInstance.png({ quality }).toBuffer();
    case 'webp':
      return sharpInstance.webp({ quality }).toBuffer();
    case 'avif':
      return sharpInstance.avif({ quality }).toBuffer();
    default:
      return sharpInstance.webp({ quality }).toBuffer();
  }
}

/**
 * Get optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(
  imagePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
  } = {}
): string {
  const params = new URLSearchParams();
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);

  const queryString = params.toString();
  return queryString ? `${imagePath}?${queryString}` : imagePath;
}
