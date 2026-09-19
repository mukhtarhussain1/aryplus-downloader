import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { FFmpegJob, FFmpegProgress } from '../video/ffmpeg';
import { config } from '../config';

export type JobStatus = 'preparing' | 'downloading' | 'completed' | 'error' | 'cancelled';

export interface DownloadJob {
  id: string;
  status: JobStatus;
  progress?: number; // 0-100
  speed?: string;
  downloadedBytes?: number;
  totalBytes?: number; // if known
  estimatedTime?: string;
  outputPath?: string;
  error?: string;
  createdAt: number;
}

class JobManager {
  private jobs: Map<string, DownloadJob> = new Map();
  private ffmpegJobs: Map<string, FFmpegJob> = new Map();

  constructor() {
    if (!fs.existsSync(config.DOWNLOAD_DIR)) {
      fs.mkdirSync(config.DOWNLOAD_DIR, { recursive: true });
    }
  }

  public createJob(streamUrl: string, filename: string): string {
    const id = uuidv4();
    const safeFilename = filename.replace(/[/\\?%*:|"<>]/g, '-') + '.mp4';
    const outputPath = path.join(config.DOWNLOAD_DIR, `${id}_${safeFilename}`);

    this.jobs.set(id, {
      id,
      status: 'preparing',
      createdAt: Date.now(),
      outputPath
    });

    this.startDownload(id, streamUrl, outputPath);
    return id;
  }

  private startDownload(id: string, streamUrl: string, outputPath: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = 'downloading';
    const ffmpegJob = new FFmpegJob(streamUrl, outputPath);
    this.ffmpegJobs.set(id, ffmpegJob);

    let durationMs = 0;
    
    ffmpegJob.on('duration', (ms: number) => {
      durationMs = ms;
    });

    ffmpegJob.on('progress', (progress: FFmpegProgress) => {
      job.speed = progress.speed;
      job.downloadedBytes = progress.totalSize;
      
      if (durationMs > 0 && progress.outTimeMs) {
        // outTimeMs is actually in microseconds for FFmpeg progress
        const outTimeMs = progress.outTimeMs / 1000;
        let percent = (outTimeMs / durationMs) * 100;
        if (percent > 100) percent = 100;
        if (percent < 0) percent = 0;
        job.progress = Math.round(percent);
      }
    });

    ffmpegJob.on('completed', () => {
      job.status = 'completed';
      this.ffmpegJobs.delete(id);
    });

    ffmpegJob.on('error', (err: Error) => {
      job.status = 'error';
      job.error = err.message;
      this.ffmpegJobs.delete(id);
    });

    ffmpegJob.on('cancelled', () => {
      job.status = 'cancelled';
      this.ffmpegJobs.delete(id);
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    });

    ffmpegJob.start();
  }

  public getJob(id: string): DownloadJob | undefined {
    return this.jobs.get(id);
  }

  public cancelJob(id: string) {
    const ffmpegJob = this.ffmpegJobs.get(id);
    if (ffmpegJob) {
      ffmpegJob.cancel();
      this.ffmpegJobs.delete(id);
    }
    const job = this.jobs.get(id);
    if (job) {
      job.status = 'cancelled';
      if (job.outputPath && fs.existsSync(job.outputPath)) {
        try {
          fs.unlinkSync(job.outputPath);
        } catch (e) {
          // ignore
        }
      }
    }
  }

  public cleanupOldJobs() {
    const now = Date.now();
    for (const [id, job] of Array.from(this.jobs.entries())) {
      if (now - job.createdAt > config.DOWNLOAD_TIMEOUT_MS) {
        this.cancelJob(id);
        this.jobs.delete(id);
      }
    }
  }
}

const globalForJobManager = globalThis as unknown as {
  downloadManager: JobManager | undefined;
};

export const downloadManager = globalForJobManager.downloadManager ?? new JobManager();

if (process.env.NODE_ENV !== 'production') {
  globalForJobManager.downloadManager = downloadManager;
}
