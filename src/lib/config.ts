export const config = {
  DEBUG_MEDIA_RESOLUTION: process.env.DEBUG_MEDIA_RESOLUTION === 'true',
  DOWNLOAD_DIR: process.env.DOWNLOAD_DIR || './downloads',
  MAX_DOWNLOAD_SIZE_MB: parseInt(process.env.MAX_DOWNLOAD_SIZE_MB || '5000', 10),
  MAX_CONCURRENT_DOWNLOADS: parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '2', 10),
  DOWNLOAD_TIMEOUT_MS: parseInt(process.env.DOWNLOAD_TIMEOUT_MS || '3600000', 10),
  ALLOWED_PAGE_DOMAIN: process.env.ALLOWED_PAGE_DOMAIN || 'aryplus.tv',
  ALLOWED_MEDIA_DOMAINS: (process.env.ALLOWED_MEDIA_DOMAINS || 'vod.aryzap.com').split(',').map(d => d.trim())
};

export function isValidAryPlusUrl(inputUrl: string): boolean {
  try {
    const url = new URL(inputUrl);
    return url.hostname === config.ALLOWED_PAGE_DOMAIN || url.hostname === `www.${config.ALLOWED_PAGE_DOMAIN}`;
  } catch (error) {
    return false;
  }
}

export function isAllowedMediaDomain(inputUrl: string): boolean {
  try {
    const url = new URL(inputUrl);
    const hostname = url.hostname.toLowerCase();
    if (config.ALLOWED_MEDIA_DOMAINS.includes(hostname)) return true;
    if (hostname.endsWith('.aryzap.com') || hostname === 'aryzap.com') return true;
    if (hostname.endsWith('.aryplus.tv') || hostname === 'aryplus.tv') return true;
    return false;
  } catch (error) {
    return false;
  }
}
