import { NextResponse } from 'next/server';
import { downloadManager } from '@/lib/download/manager';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  const job = downloadManager.getJob(params.jobId);
  
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const response: any = {
    status: job.status,
    progress: job.progress,
    downloaded: job.downloadedBytes ? `${(job.downloadedBytes / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
    speed: job.speed || '0x'
  };

  if (job.status === 'completed') {
    response.downloadUrl = `/api/files/${job.id}`;
  } else if (job.status === 'error') {
    response.error = job.error;
  }

  return NextResponse.json(response);
}
