import { Parser } from 'm3u8-parser';
import { StreamQuality } from '../aryplus/types';

export async function parseHlsPlaylist(url: string): Promise<StreamQuality[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch HLS playlist: ${res.statusText}`);
  }
  const content = await res.text();
  
  const parser = new Parser();
  parser.push(content);
  parser.end();

  const manifest = parser.manifest;
  const baseUrl = new URL(url);

  // If it's a master playlist with variants
  if (manifest.playlists && manifest.playlists.length > 0) {
    return manifest.playlists.map((playlist: any, index: number) => {
      const resolution = playlist.attributes.RESOLUTION;
      const bandwidth = playlist.attributes.BANDWIDTH;
      
      let quality = 'auto';
      if (resolution) {
        quality = `${resolution.height}p`;
      } else if (bandwidth) {
        if (bandwidth > 3000000) quality = '1080p';
        else if (bandwidth > 1500000) quality = '720p';
        else if (bandwidth > 800000) quality = '480p';
        else quality = '360p';
      }

      // Resolve relative URL
      let variantUrl = playlist.uri;
      if (!variantUrl.startsWith('http')) {
        variantUrl = new URL(variantUrl, baseUrl).toString();
      }

      return {
        id: `variant_${index}_${quality}`,
        quality,
        url: variantUrl,
        type: 'hls',
        bandwidth,
        resolution
      };
    }).sort((a: StreamQuality, b: StreamQuality) => (b.resolution?.height || 0) - (a.resolution?.height || 0));
  }

  // If it's a direct media playlist
  return [{
    id: 'default',
    quality: 'Direct Stream',
    url,
    type: 'hls'
  }];
}
