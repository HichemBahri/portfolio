import { decode } from 'blurhash';

/**
 * Convert a blurhash string to a data URL for use as a placeholder
 */
export function blurhashToDataURL(blurhash: string, width: number = 32, height: number = 32): string {
  try {
    const pixels = decode(blurhash, width, height);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to data URL
    const dataURL = canvas.convertToBlob({ type: 'image/png' }).then(blob => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    });

    return dataURL as unknown as string;
  } catch (error) {
    console.error('Error converting blurhash to data URL:', error);
    // Return a fallback placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}

/**
 * Generate a CSS background image from blurhash
 */
export function blurhashToCSS(blurhash: string, width: number = 32, height: number = 32): string {
  try {
    const pixels = decode(blurhash, width, height);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    // Convert to base64 data URL
    const dataURL = canvas.convertToBlob({ type: 'image/png' }).then(blob => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    });

    return `url(${dataURL as unknown as string})`;
  } catch (error) {
    console.error('Error converting blurhash to CSS:', error);
    return 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)';
  }
}

/**
 * Create a simple gradient placeholder as fallback
 */
export function createGradientPlaceholder(width: number = 32, height: number = 32): string {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }

  // Create a simple gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.convertToBlob({ type: 'image/png' }).then(blob => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }) as unknown as string;
}
