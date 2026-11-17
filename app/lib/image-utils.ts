import { encode } from 'blurhash';
import sharp from 'sharp';

async function getBufferFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

export async function generateBlurhash(imageUrl: string): Promise<string | null> {
  try {
    const buffer = await getBufferFromUrl(imageUrl);
    const { data, info } = await sharp(buffer)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    const blurhash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
    return blurhash;
  } catch (error) {
    console.error('Failed to generate blurhash:', error);
    return null;
  }
}
