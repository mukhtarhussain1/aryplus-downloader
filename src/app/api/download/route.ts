import { NextResponse } from 'next/server';
import { downloadManager } from '@/lib/download/manager';

export async function POST(req: Request) {
  try {
    const { streamUrl, title } = await req.json();
    
    if (!streamUrl) {
      return NextResponse.json({ success: false, error: 'streamUrl is required' }, { status: 400 });
    }

    const jobId = downloadManager.createJob(streamUrl, title || 'download');

    return NextResponse.json({
      success: true,
      jobId
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to start download' }, { status: 500 });
  }
}
