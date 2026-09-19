import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export interface FFmpegProgress {
  frame: number;
  fps: number;
  bitrate: string;
  totalSize: number;
  outTimeMs: number;
  outTime: string;
  dupFrames: number;
  dropFrames: number;
  speed: string;
  progress: string; // 'continue' or 'end'
}

export class FFmpegJob extends EventEmitter {
  private process: any;
  private isCancelled = false;
  
  constructor(private inputUrl: string, private outputPath: string) {
    super();
  }

  public start() {
    // Basic FFmpeg command for HLS stream copy
    const args = [
      '-y', // Overwrite
      '-i', this.inputUrl,
      '-c', 'copy', // Stream copy (no re-encoding)
      '-movflags', '+faststart',
      '-progress', 'pipe:1',
      this.outputPath
    ];

    this.process = spawn('ffmpeg', args);

    this.process.stdout.on('data', (data: Buffer) => {
      this.parseProgress(data.toString());
    });

    let totalDurationMs: number | undefined;
    let stderrBuffer = '';

    this.process.stderr.on('data', (data: Buffer) => {
      const text = data.toString();
      
      if (totalDurationMs === undefined) {
        stderrBuffer += text;
        const durationMatch = stderrBuffer.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
        if (durationMatch) {
          const hours = parseInt(durationMatch[1], 10);
          const minutes = parseInt(durationMatch[2], 10);
          const seconds = parseInt(durationMatch[3], 10);
          const centis = parseInt(durationMatch[4], 10);
          totalDurationMs = ((hours * 3600) + (minutes * 60) + seconds) * 1000 + (centis * 10);
          this.emit('duration', totalDurationMs);
        }
        // Prevent buffer from growing indefinitely if no duration is found
        if (stderrBuffer.length > 10000) {
          stderrBuffer = stderrBuffer.slice(-5000);
        }
      }
      
      this.emit('log', text);
    });

    this.process.on('close', (code: number) => {
      if (this.isCancelled) {
        this.emit('cancelled');
      } else if (code === 0) {
        this.emit('completed', this.outputPath);
      } else {
        this.emit('error', new Error(`FFmpeg exited with code ${code}`));
      }
    });
    
    this.process.on('error', (err: Error) => {
      this.emit('error', err);
    });
  }

  public cancel() {
    this.isCancelled = true;
    if (this.process) {
      this.process.kill('SIGKILL');
    }
  }

  private parseProgress(data: string) {
    const lines = data.split('\n');
    const progressObj: any = {};
    
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length === 2) {
        progressObj[parts[0].trim()] = parts[1].trim();
      }
    });

    if (Object.keys(progressObj).length > 0) {
      this.emit('progress', {
        frame: parseInt(progressObj.frame, 10) || 0,
        fps: parseFloat(progressObj.fps) || 0,
        bitrate: progressObj.bitrate || '',
        totalSize: parseInt(progressObj.total_size, 10) || 0,
        outTimeMs: parseInt(progressObj.out_time_ms, 10) || 0,
        outTime: progressObj.out_time || '',
        speed: progressObj.speed || '',
        progress: progressObj.progress || ''
      });
    }
  }
}
