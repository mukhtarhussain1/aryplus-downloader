import { NextResponse } from 'next/server';
import { downloadManager } from '@/lib/download/manager';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  const job = downloadManager.getJob(params.jobId);
  
  if (!job || !job.outputPath || !fs.existsSync(job.outputPath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const stat = fs.statSync(job.outputPath);
  const stream = fs.createReadStream(job.outputPath);
  const filename = path.basename(job.outputPath).split('_').slice(1).join('_');

  // Next.js Response supports Node.js readable streams
  const res = new NextResponse(stream as any, {
    headers: {
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size.toString(),
    },
  });

  return res;
}
