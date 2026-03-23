
import { NextRequest, NextResponse } from 'next/server';
import { getR2SignedUploadUrl } from '@/lib/server/r2';

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType = 'image/jpeg' } = await request.json();
    const key = `uploads/${Date.now()}-${filename}`;
    const url = await getR2SignedUploadUrl(key, contentType);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('R2 signed URL error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

