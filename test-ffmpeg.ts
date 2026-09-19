import { FFmpegJob } from './src/lib/video/ffmpeg';

const job = new FFmpegJob("https://vod.aryzap.com/0e66b809vodtranshk1313565080/86c7409b5001834820509423484/video_10_0.m3u8", "test.mp4");

job.on('duration', (ms) => {
    console.log('Duration MS:', ms);
});

job.on('progress', (prog) => {
    console.log('Progress:', prog);
    if (prog.outTimeMs > 0) {
        process.exit(0);
    }
});

job.start();
