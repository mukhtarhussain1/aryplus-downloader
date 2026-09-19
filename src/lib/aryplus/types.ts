export interface StreamQuality {
  id: string;
  quality: string;
  url: string;
  type: 'hls';
  bandwidth?: number;
  resolution?: { width: number; height: number };
}

export interface ResolvedMedia {
  title: string;
  seriesName?: string;
  thumbnail?: string;
  duration?: number;
  streams: StreamQuality[];
}

export interface MediaResolver {
  canHandle(url: URL): boolean;
  resolve(url: URL): Promise<ResolvedMedia>;
}
