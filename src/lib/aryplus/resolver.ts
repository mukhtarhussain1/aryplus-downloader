import { chromium, Browser, Page } from 'playwright';
import { MediaResolver, ResolvedMedia, StreamQuality } from './types';
import { isAllowedMediaDomain, isValidAryPlusUrl, config } from '../config';

export class AryPlusResolver implements MediaResolver {
  canHandle(url: URL): boolean {
    return isValidAryPlusUrl(url.toString());
  }

  async resolve(url: URL): Promise<ResolvedMedia> {
    let browser: Browser | null = null;
    let page: Page | null = null;
    try {
      if (config.DEBUG_MEDIA_RESOLUTION) {
        console.log(`[ARY] Resolving URL via Playwright: ${url.toString()}`);
      }
      
      browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--autoplay-policy=no-user-gesture-required'
        ]
      });

      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 720 },
      });

      page = await context.newPage();
      
      const m3u8Candidates: string[] = [];
      let pageTitle = '';

      // Intercept network requests to find the HLS playlists
      page.on('request', request => {
        const reqUrl = request.url();
        if (reqUrl.includes('.m3u8') && isAllowedMediaDomain(reqUrl)) {
          if (config.DEBUG_MEDIA_RESOLUTION) {
            console.log(`[ARY] HLS candidate found: ${reqUrl}`);
          }
          if (!m3u8Candidates.includes(reqUrl)) {
            m3u8Candidates.push(reqUrl);
          }
        }
      });

      try {
        await page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 35000 });
        
        // Attempt to click play button if the player is waiting for user gesture
        try {
          const playBtn = page.locator('.rmp-overlay-play-button, button.play, [aria-label="Play"], .vjs-big-play-button').first();
          if (await playBtn.count() > 0) {
            await playBtn.click({ timeout: 2000 }).catch(() => {});
          }
        } catch (e) {
          // ignore play button click error
        }

        // Wait up to 10 seconds, polling until at least one stream is intercepted
        for (let i = 0; i < 20; i++) {
          if (m3u8Candidates.length > 0) break;
          await page.waitForTimeout(500);
        }

        pageTitle = await page.title();
      } catch (err) {
        console.error(`[ARY] Page load error (ignoring if we found streams):`, err);
      }

      if (m3u8Candidates.length === 0) {
        throw new Error('Could not find an accessible video stream.');
      }

      // Often ARY has a master playlist (adp.m3u8 or similar) or direct media playlists (video_10_0.m3u8)
      // We will return the candidates. We should prefer adp/master playlist if it exists.
      let finalUrl = m3u8Candidates[0];
      const masterPlaylist = m3u8Candidates.find(u => u.includes('adp') || !u.match(/_\d+_\d+\.m3u8$/));
      if (masterPlaylist) {
        finalUrl = masterPlaylist;
      }
      
      if (config.DEBUG_MEDIA_RESOLUTION) {
        console.log(`[ARY] Selected playlist: ${finalUrl}`);
      }

      // The title is often "ARY PLUS - A Video Streaming Portal" initially, so let's try to find a better one
      let showTitle = 'ARY Plus Episode';
      let thumbnail = '';
      try {
        const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
        if (ogTitle && !ogTitle.includes('ARY PLUS')) showTitle = ogTitle;
        
        // Check video poster first or page images
        const pageMediaInfo = await page.evaluate(() => {
          const video = document.querySelector('video');
          const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
          const firstContentImg = document.querySelector('img[src*="cdnv1"], img[src*="images.aryplus.tv/cdn"]')?.getAttribute('src');
          return {
            poster: video?.poster || '',
            ogImage: ogImg || '',
            contentImg: firstContentImg || ''
          };
        });

        let rawThumbnail = pageMediaInfo.poster || pageMediaInfo.ogImage || pageMediaInfo.contentImg;

        if (rawThumbnail) {
          if (rawThumbnail.startsWith('http://') || rawThumbnail.startsWith('https://')) {
            thumbnail = rawThumbnail;
          } else if (rawThumbnail.startsWith('//')) {
            thumbnail = `https:${rawThumbnail}`;
          } else {
            // Relative path like cdnv1/... or /cdnv1/...
            const cleanPath = rawThumbnail.replace(/^\/+/, '');
            thumbnail = `https://images.aryplus.tv/${cleanPath}`;
          }
        }
      } catch (e) {
        // ignore
      }

      // Let's create a single stream candidate for now. 
      // The HLS parser will expand this if it's a master playlist.
      const streams: StreamQuality[] = [{
        id: 'default',
        quality: 'auto', // Will be refined by HLS parser
        url: finalUrl,
        type: 'hls'
      }];

      return {
        title: showTitle,
        thumbnail,
        streams
      };

    } finally {
      if (page) await page.close().catch(() => {});
      if (browser) await browser.close().catch(() => {});
    }
  }
}
