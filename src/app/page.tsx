'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { DownloaderHero } from '@/components/DownloaderHero';
import { GuideSection } from '@/components/GuideSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';

import { ResolvedMedia } from '@/lib/aryplus/types';
import { DownloadStatusData } from '@/components/DownloaderHero';

export default function Home() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const [metadata, setMetadata] = useState<ResolvedMedia | null>(null);
  const [selectedStream, setSelectedStream] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatusData | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setAnalyzing(true);
    setError('');
    setMetadata(null);
    setImageError(false);
    setJobId(null);
    setDownloadStatus(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to analyze URL. Please verify the link.');
      } else {
        setMetadata(data);
        if (data.streams && data.streams.length > 0) {
          setSelectedStream(data.streams[0].url);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while communicating with the server.';
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const startDownload = async () => {
    if (!selectedStream || !metadata) return;
    try {
      setError('');
      setCancelling(false);
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamUrl: selectedStream,
          title: metadata.title,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to start download');
      } else {
        setJobId(data.jobId);
        setDownloadStatus({
          status: 'preparing',
          progress: 0,
          downloaded: '0 MB',
          speed: '0x',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while initializing download';
      setError(message);
    }
  };

  const cancelDownload = async () => {
    if (!jobId) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/cancel/${jobId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setDownloadStatus((prev) => (prev ? {
          ...prev,
          status: 'cancelled',
        } : null));
      }
    } catch (err) {
      console.error('Failed to cancel download:', err);
    } finally {
      setCancelling(false);
    }
  };

  const resetToSelection = () => {
    setJobId(null);
    setDownloadStatus(null);
    setCancelling(false);
  };

  const handleNavbarAction = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const currentStatus = downloadStatus?.status;
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isOngoing = currentStatus === 'downloading' || currentStatus === 'preparing';
    if (jobId && isOngoing) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/status/${jobId}`);
          if (res.ok) {
            const data = await res.json();
            setDownloadStatus(data);
          }
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jobId, currentStatus]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Navbar onPasteClick={handleNavbarAction} />

      <main className="flex-1">
        {/* Downloading section at the top in Hero */}
        <DownloaderHero
          url={url}
          setUrl={setUrl}
          analyzing={analyzing}
          error={error}
          metadata={metadata}
          selectedStream={selectedStream}
          setSelectedStream={setSelectedStream}
          imageError={imageError}
          setImageError={setImageError}
          jobId={jobId}
          downloadStatus={downloadStatus}
          cancelling={cancelling}
          onAnalyze={analyzeUrl}
          onStartDownload={startDownload}
          onCancelDownload={cancelDownload}
          onReset={resetToSelection}
          inputRef={inputRef}
        />

        {/* Complete Guide to Downloading */}
        <GuideSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* FAQs Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
