import { NextRequest, NextResponse } from 'next/server';
import { getCloudinaryUploadSignature } from '@/lib/server/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const folder = typeof body.folder === 'string' && body.folder.trim() ? body.folder.trim() : 'uploads';
    const config = getCloudinaryUploadSignature(folder);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
  }
}
