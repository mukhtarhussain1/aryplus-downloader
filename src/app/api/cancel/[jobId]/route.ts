import { NextResponse } from 'next/server';
import { downloadManager } from '@/lib/download/manager';

export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    downloadManager.cancelJob(jobId);

    return NextResponse.json({
      success: true,
      message: 'Download cancelled successfully'
    });
  } catch (error: any) {
    console.error('Cancel error:', error);
    return NextResponse.json({ error: error.message || 'Failed to cancel download' }, { status: 500 });
  }
}
