import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../../utils/logger.js";
import { updateJob } from "../../store/jobs.store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.resolve(__dirname, "../../../downloads");

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
}

export function getInfo(url: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", ["--dump-json", url]);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `yt-dlp exited with code ${code}`));
        return;
      }
      try {
        const data = JSON.parse(stdout);
        resolve({
          title: data.title,
          thumbnail: data.thumbnail,
          duration: data.duration,
        });
      } catch {
        reject(new Error("Failed to parse yt-dlp output"));
      }
    });

    proc.on("error", reject);
  });
}

export function startDownload(url: string, jobId: string): void {
  const outputTemplate = path.join(DOWNLOADS_DIR, `${jobId}.%(ext)s`);

  const proc = spawn("yt-dlp", [
    "-x",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--newline",
    "-o",
    outputTemplate,
    url,
  ]);

  proc.stdout?.on("data", (chunk: Buffer) => {
    const lines = chunk.toString().split("\n");
    for (const line of lines) {
      const pct = parseProgress(line);
      if (pct !== null) {
        updateJob(jobId, { status: "downloading", progress: pct });
      }
    }
  });

  proc.stderr?.on("data", (chunk: Buffer) => {
    logger.warn(`[yt-dlp stderr] ${chunk.toString().trim()}`);
  });

  proc.on("close", (code) => {
    if (code === 0) {
      updateJob(jobId, { status: "done", progress: 100 });
    } else {
      const msg = `yt-dlp exited with code ${code}`;
      logger.error(`Download failed for job ${jobId}: ${msg}`);
      updateJob(jobId, { status: "error", error: msg });
    }
  });

  proc.on("error", (err) => {
    logger.error(`Download failed for job ${jobId}: ${err.message}`);
    updateJob(jobId, { status: "error", error: err.message });
  });
}

function parseProgress(line: string): number | null {
  const match = line.match(/\[download\]\s+(\d+\.?\d*)%/);
  return match ? parseFloat(match[1]) : null;
}