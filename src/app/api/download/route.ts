import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const streamUrl = searchParams.get('streamUrl');
    const title = searchParams.get('title') || 'aryplus-video';

    if (!streamUrl) {
      return new Response('streamUrl query parameter is required', { status: 400 });
    }

    const safeTitle = (title || 'aryplus-video')
      .replace(/[/\\?%*:|"<>]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();

    // ASCII filename fallback + RFC 5987 UTF-8 encoding
    const asciiFilename = safeTitle.replace(/[^\x20-\x7E]/g, '') || 'aryplus-video';
    const encodedFilename = encodeURIComponent(safeTitle);

    // Spawn FFmpeg to remux HLS directly to an MP4 stream on stdout
    const ffmpeg = spawn('ffmpeg', [
      '-reconnect', '1',
      '-reconnect_streamed', '1',
      '-reconnect_delay_max', '5',
      '-i', streamUrl,
      '-c', 'copy',
      '-bsf:a', 'aac_adtstoasc',
      '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
      '-f', 'mp4',
      'pipe:1'
    ]);

    let stderrBuffer = '';

    // Drain stderr so FFmpeg's OS pipe buffer does not fill up and block streaming
    ffmpeg.stderr.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stderrBuffer = (stderrBuffer + text).slice(-2000);
    });

    const stream = new ReadableStream({
      start(controller) {
        ffmpeg.stdout.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        ffmpeg.stdout.on('end', () => {
          controller.close();
        });
        ffmpeg.on('error', (err) => {
          console.error('[FFmpeg Stream Error]:', err);
          controller.error(err);
        });
        ffmpeg.on('close', (code) => {
          if (code !== 0 && code !== null) {
            console.error(`[FFmpeg Stream Exited with code ${code}]:`, stderrBuffer);
          }
        });
      },
      cancel() {
        console.log('[FFmpeg Stream Cancelled]: Client disconnected, terminating process');
        ffmpeg.kill('SIGKILL');
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${asciiFilename}.mp4"; filename*=UTF-8''${encodedFilename}.mp4`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (err: any) {
    console.error('[Download Route Error]:', err);
    return new Response(err.message || 'Internal Server Error', { status: 500 });
  }
}

// Keep POST for backward compatibility
export async function POST(req: Request) {
  try {
    const { streamUrl, title } = await req.json();
    if (!streamUrl) {
      return NextResponse.json({ success: false, error: 'streamUrl is required' }, { status: 400 });
    }
    const downloadUrl = `/api/download?streamUrl=${encodeURIComponent(streamUrl)}&title=${encodeURIComponent(title || 'download')}`;
    return NextResponse.json({
      success: true,
      downloadUrl
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to start download' }, { status: 500 });
  }
}
