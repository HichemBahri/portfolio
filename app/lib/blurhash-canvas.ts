import { decode } from 'blurhash';

/**
 * Check if we're running in the browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Create a simple gradient placeholder as fallback
 */
function createGradientPlaceholder(width: number, height: number): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <rect width="100%" height="100%" fill="url(#gradient)"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
      </linearGradient>
    </defs>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Convert blurhash to a data URL that can be used as a placeholder
 */
export function blurhashToDataURL(blurhash: string, width: number = 32, height: number = 32): string {
  // If we're not in the browser, return a gradient placeholder
  if (!isBrowser()) {
    return createGradientPlaceholder(width, height);
  }

  try {
    const pixels = decode(blurhash, width, height);
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Create ImageData from the decoded pixels
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    
    // Draw the image data to canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Convert canvas to data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error converting blurhash to data URL:', error);
    // Return a fallback gradient
    return createGradientPlaceholder(width, height);
  }
}
