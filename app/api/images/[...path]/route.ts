import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const imagePath = resolvedParams.path.join('/');
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : undefined;
    const height = searchParams.get('h') ? parseInt(searchParams.get('h')!) : undefined;
    const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : 80;
    const format = searchParams.get('f') as 'jpeg' | 'png' | 'webp' | 'avif' || 'webp';

    // Read the original image
    const imageBuffer = fs.readFileSync(fullPath);
    
    // Process with Sharp
    let sharpInstance = sharp(imageBuffer);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert to requested format
    let processedBuffer: Buffer;
    switch (format) {
      case 'jpeg':
        processedBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
        break;
      case 'png':
        processedBuffer = await sharpInstance.png({ quality }).toBuffer();
        break;
      case 'webp':
        processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
        break;
      case 'avif':
        processedBuffer = await sharpInstance.avif({ quality }).toBuffer();
        break;
      default:
        processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
    }

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', `image/${format}`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    return new NextResponse(new Uint8Array(processedBuffer), { headers });
  } catch (error) {
    console.error('Error processing image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
