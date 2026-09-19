import { NextResponse } from 'next/server';
import { AryPlusResolver } from '@/lib/aryplus/resolver';
import { parseHlsPlaylist } from '@/lib/video/hls';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const inputUrl = new URL(url);
    const resolver = new AryPlusResolver();

    if (!resolver.canHandle(inputUrl)) {
      return NextResponse.json({ success: false, error: 'Invalid ARY Plus URL' }, { status: 400 });
    }

    const resolved = await resolver.resolve(inputUrl);
    
    if (resolved.streams.length === 0) {
      return NextResponse.json({ success: false, error: 'No accessible video stream found.' }, { status: 404 });
    }

    // Try to parse the HLS playlist to get variants
    const primaryStreamUrl = resolved.streams[0].url;
    let finalStreams = resolved.streams;

    try {
      const parsedStreams = await parseHlsPlaylist(primaryStreamUrl);
      if (parsedStreams.length > 0) {
        finalStreams = parsedStreams;
      }
    } catch (err) {
      console.error('HLS parse error:', err);
    }

    return NextResponse.json({
      success: true,
      title: resolved.title,
      thumbnail: resolved.thumbnail,
      duration: resolved.duration,
      streams: finalStreams
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
