'use client';

import React, { useRef } from 'react';
import { 
  IconSparkles, 
  IconLink, 
  IconCopy, 
  IconX, 
  IconSpinner, 
  IconDownload, 
  IconCheck, 
  IconFilm, 
  IconShield, 
  IconZap, 
  IconAlertTriangle, 
  IconRefresh 
} from './Icons';

import { ResolvedMedia, StreamQuality } from '@/lib/aryplus/types';

export interface DownloadStatusData {
  status: 'preparing' | 'downloading' | 'completed' | 'cancelled' | 'error';
  progress?: number;
  downloaded?: string;
  speed?: string;
  downloadUrl?: string;
  error?: string;
}

interface DownloaderHeroProps {
  url: string;
  setUrl: (url: string) => void;
  analyzing: boolean;
  error: string;
  metadata: ResolvedMedia | null;
  selectedStream: string;
  setSelectedStream: (stream: string) => void;
  imageError: boolean;
  setImageError: (val: boolean) => void;
  jobId: string | null;
  downloadStatus: DownloadStatusData | null;
  cancelling: boolean;
  onAnalyze: (e: React.FormEvent) => void;
  onStartDownload: () => void;
  onCancelDownload: () => void;
  onReset: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function DownloaderHero({
  url,
  setUrl,
  analyzing,
  error,
  metadata,
  selectedStream,
  setSelectedStream,
  imageError,
  setImageError,
  jobId,
  downloadStatus,
  cancelling,
  onAnalyze,
  onStartDownload,
  onCancelDownload,
  onReset,
  inputRef,
}: DownloaderHeroProps) {
  const localInputRef = useRef<HTMLInputElement>(null);
  const effectiveInputRef = inputRef || localInputRef;
  const [downloadStarted, setDownloadStarted] = React.useState(false);

  const handleDirectDownload = () => {
    if (!selectedStream || !metadata) return;
    const downloadUrl = `/api/download?streamUrl=${encodeURIComponent(selectedStream)}&title=${encodeURIComponent(metadata.title)}`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', `${metadata.title || 'aryplus-video'}.mp4`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadStarted(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    setDownloadStarted(false);
    onAnalyze(e);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          if (effectiveInputRef.current) {
            effectiveInputRef.current.focus();
          }
        }
      }
    } catch (err) {
      console.warn('Could not read clipboard', err);
    }
  };

  const selectedStreamObj = metadata?.streams?.find((s: StreamQuality) => s.url === selectedStream);

  const getQualityBadge = (quality: string, resolution?: { width: number; height: number }) => {
    const height = resolution?.height;
    if (height && height >= 1080) return { label: 'Full HD', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    if (height && height >= 720) return { label: 'HD', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (quality?.toLowerCase().includes('1080') || quality?.toLowerCase().includes('high')) {
      return { label: 'Full HD', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    }
    if (quality?.toLowerCase().includes('720')) {
      return { label: 'HD', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    return { label: 'Standard', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  return (
    <section id="downloader" className="relative pt-10 pb-16 md:py-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 flex justify-center">
        <div className="w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-red-100/30 to-amber-100/40 blur-3xl rounded-full opacity-70"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <IconSparkles className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>Premium ARY Plus Video Downloader</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
          Download ARY Plus Videos in{' '}
          <span className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-clip-text text-transparent">
            Crystal-Clear HD
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Save your favorite Pakistani dramas, reality TV, morning shows, and news in pristine 1080p MP4. Free, fast, and ready for offline viewing.
        </p>

        {/* Central Downloader Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 transition-all text-left relative">
          
          {/* Form Input */}
          <form onSubmit={handleFormSubmit} className="relative mb-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
                  <IconLink className="w-5 h-5" />
                </div>
                
                <input
                  ref={effectiveInputRef}
                  type="url"
                  placeholder="Paste ARY Plus URL (e.g., https://aryplus.tv/...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 sm:pl-11 pr-20 sm:pr-24 py-3.5 sm:py-4 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-inner"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  disabled={analyzing}
                />

                {/* Paste & Clear buttons inside input */}
                <div className="absolute inset-y-0 right-0 pr-2 sm:pr-2.5 flex items-center gap-1">
                  {url && !analyzing && (
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Clear URL"
                    >
                      <IconX className="w-4 h-4" size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 text-xs font-semibold px-2 sm:px-2.5 py-1.5 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
                    title="Paste from clipboard"
                  >
                    <IconCopy className="w-3.5 h-3.5" size={14} />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={analyzing || !url.trim()}
                className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 sm:py-4 px-6 sm:px-7 rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 text-sm sm:text-base shrink-0 cursor-pointer active:scale-[0.99]"
              >
                {analyzing ? (
                  <>
                    <IconSpinner className="w-5 h-5 text-white" size={18} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-4 h-4 text-amber-200" size={16} />
                    <span>Analyze Video</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
              <span>💡 Tip:</span>
              <span>Works with any accessible ARY Plus episode, show, or clip. No login needed.</span>
            </p>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-sm animate-in fade-in">
              <IconAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Analysis Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Analyzed Episode Preview Card */}
          {metadata && (
            <div className="border-t border-slate-100 pt-6 mt-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row gap-5 items-start bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
                {metadata.thumbnail && !imageError ? (
                  <div className="w-full sm:w-48 aspect-video bg-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={metadata.thumbnail}
                      alt={metadata.title}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">
                      ARY Plus
                    </span>
                  </div>
                ) : (
                  <div className="w-full sm:w-48 aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <IconFilm className="w-10 h-10 mb-1 opacity-60 text-slate-500" />
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">ARY Plus VOD</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200/70">
                      <IconCheck className="w-3 h-3 text-rose-600" />
                      Episode Ready
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {metadata.streams?.length || 0} stream qualities found
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                    {metadata.title}
                  </h2>

                  {selectedStreamObj && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                      <span className="font-medium text-slate-500">Selected Quality:</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-rose-600 shadow-2xs">
                        {selectedStreamObj.quality}{' '}
                        {selectedStreamObj.resolution
                          ? `(${selectedStreamObj.resolution.width}x${selectedStreamObj.resolution.height})`
                          : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quality Selection Grid (When download not yet triggered) */}
          {metadata && !downloadStarted && (
            <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <label className="font-bold text-slate-800 text-sm tracking-wide flex items-center gap-2">
                  <span>Select Video Quality</span>
                  <span className="text-xs font-normal text-slate-500">(Highest resolution recommended)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {metadata.streams.map((stream: StreamQuality, idx: number) => {
                  const isSelected = selectedStream === stream.url;
                  const badge = getQualityBadge(stream.quality, stream.resolution);

                  return (
                    <label
                      key={idx}
                      className={`relative flex flex-col p-3.5 sm:p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/50 shadow-sm ring-1 ring-rose-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quality"
                        value={stream.url}
                        checked={isSelected}
                        onChange={(e) => setSelectedStream(e.target.value)}
                        className="sr-only"
                      />

                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <IconCheck className="w-3 h-3 stroke-[3]" size={12} />}
                        </div>
                      </div>

                      <div className={`font-extrabold text-base sm:text-lg mb-0.5 ${isSelected ? 'text-rose-700' : 'text-slate-800'}`}>
                        {stream.quality}
                      </div>

                      {stream.resolution && (
                        <div className="text-xs text-slate-500 font-medium">
                          {stream.resolution.width} × {stream.resolution.height}
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              <button
                onClick={handleDirectDownload}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex justify-center items-center gap-2.5 text-base cursor-pointer active:scale-[0.99]"
              >
                <IconDownload className="w-5 h-5 text-white" size={20} />
                <span>Download MP4 to Device</span>
              </button>
            </div>
          )}

          {/* Download Started Feedback State */}
          {metadata && downloadStarted && (
            <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-6 text-center shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <IconCheck className="w-6 h-6 stroke-[2.5]" size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">
                  Download Started Directly to Your Device!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                  Your browser has initiated the download for <strong className="text-slate-800">{metadata.title}</strong> directly into your local storage.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleDirectDownload}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-xl text-sm transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <IconDownload className="w-4 h-4 text-slate-600" size={16} />
                    <span>Download Again</span>
                  </button>
                  <button
                    onClick={() => {
                      setDownloadStarted(false);
                      onReset();
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <IconRefresh className="w-4 h-4 text-slate-300" size={16} />
                    <span>Download Another Episode</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Download & Progress Status */}
          {jobId && downloadStatus && (
            <div className="border-t border-slate-100 pt-6 mt-6 animate-in fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    {downloadStatus.status === 'downloading' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        downloadStatus.status === 'downloading'
                          ? 'bg-rose-500'
                          : downloadStatus.status === 'error' || downloadStatus.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                  </span>
                  <span className="font-bold text-slate-900 text-base">Processing Download</span>
                </div>

                <span
                  className={`text-xs uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold border ${
                    downloadStatus.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : downloadStatus.status === 'downloading'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {downloadStatus.status}
                </span>
              </div>

              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 mb-6 shadow-xs">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900">
                      {downloadStatus.status === 'downloading'
                        ? `${downloadStatus.progress || 0}%`
                        : downloadStatus.status === 'completed'
                        ? '100%'
                        : downloadStatus.status}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                      {downloadStatus.status === 'downloading'
                        ? 'Downloading segments & remuxing into universal MP4...'
                        : downloadStatus.status === 'preparing'
                        ? 'Establishing secure stream connection...'
                        : downloadStatus.status === 'completed'
                        ? 'Remuxing completed! Your MP4 file is ready.'
                        : 'Job finished'}
                    </div>
                  </div>

                  {downloadStatus.status === 'downloading' && (
                    <div className="text-right">
                      <div className="text-slate-900 font-bold text-sm sm:text-base">{downloadStatus.downloaded}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Speed: <span className="text-slate-800 font-semibold">{downloadStatus.speed}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${
                      downloadStatus.status === 'error' || downloadStatus.status === 'cancelled'
                        ? 'bg-slate-400'
                        : downloadStatus.status === 'completed'
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-rose-500 to-red-600'
                    } transition-all duration-300 ease-out`}
                    style={{
                      width:
                        downloadStatus.status === 'completed' ? '100%' : `${downloadStatus.progress || 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Status Action Buttons */}
              {(downloadStatus.status === 'downloading' || downloadStatus.status === 'preparing') && (
                <button
                  onClick={onCancelDownload}
                  disabled={cancelling}
                  className="w-full border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <IconX className="w-4 h-4" />
                  <span>{cancelling ? 'Cancelling Process...' : 'Cancel Download'}</span>
                </button>
              )}

              {downloadStatus.status === 'completed' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={downloadStatus.downloadUrl}
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-base"
                    download
                  >
                    <IconDownload className="w-5 h-5 text-white" />
                    <span>Save MP4 to Device</span>
                  </a>
                  <button
                    onClick={onReset}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-xl transition-colors text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <IconRefresh className="w-4 h-4 text-slate-500" />
                    <span>Change Quality</span>
                  </button>
                </div>
              )}

              {downloadStatus.status === 'cancelled' && (
                <div className="text-center py-2">
                  <p className="text-slate-500 mb-4 text-sm">Download was cancelled and temporary files were cleaned up.</p>
                  <button
                    onClick={onReset}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm cursor-pointer"
                  >
                    Back to Quality Selection
                  </button>
                </div>
              )}

              {downloadStatus.status === 'error' && (
                <div>
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-4 text-sm">
                    {downloadStatus.error || 'An error occurred during video download.'}
                  </div>
                  <button
                    onClick={onReset}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hero Trust Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 pt-4">
          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <IconShield className="w-4 h-4" />
            </div>
            <span>100% Free & Safe</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <IconZap className="w-4 h-4" />
            </div>
            <span>Ultra Fast Remux</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IconFilm className="w-4 h-4" />
            </div>
            <span>Up to 1080p FHD</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs sm:text-sm font-medium">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <IconCheck className="w-4 h-4" />
            </div>
            <span>No Account Needed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
