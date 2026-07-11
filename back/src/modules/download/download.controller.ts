import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { isValidYoutubeUrl } from "../../utils/validateUrl.js";
import { BadRequestError, NotFoundError } from "../../utils/appError.js";
import { getInfo, startDownload } from "./ytdlp.service.js";
import { createJob, getJob, deleteJob } from "../../store/jobs.store.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS_DIR = path.resolve(__dirname, "../../../downloads");

export async function infoHandler(req: Request, res: Response) {
  const { url } = req.body;

  if (!url || !isValidYoutubeUrl(url)) {
    throw new BadRequestError("Invalid YouTube URL");
  }

  const info = await getInfo(url);
  res.json(info);
}

export async function downloadHandler(req: Request, res: Response) {
  const { url, title } = req.body;

  if (!url || !isValidYoutubeUrl(url)) {
    throw new BadRequestError("Invalid YouTube URL");
  }

  const jobId = uuidv4();
  createJob(jobId, title);

  startDownload(url, jobId);

  res.json({ jobId });
}

export async function progressHandler(req: Request, res: Response) {
  const jobId = req.params.jobId as string;
  const job = getJob(jobId);

  if (!job) {
    throw new NotFoundError("Job");
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const interval = setInterval(() => {
    const current = getJob(jobId);
    if (!current) {
      res.write(`data: ${JSON.stringify({ status: "error", error: "Job not found" })}\n\n`);
      res.end();
      clearInterval(interval);
      return;
    }

    res.write(`data: ${JSON.stringify({ status: current.status, progress: current.progress })}\n\n`);

    if (current.status === "done" || current.status === "error") {
      res.end();
      clearInterval(interval);
    }
  }, 500);

  req.on("close", () => {
    clearInterval(interval);
  });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "untitled";
}

export async function fileHandler(req: Request, res: Response) {
  const jobId = req.params.jobId as string;
  const job = getJob(jobId);

  if (!job) {
    throw new NotFoundError("Job");
  }

  if (job.status !== "done") {
    throw new BadRequestError("Download not ready yet");
  }

  const filePath = path.join(DOWNLOADS_DIR, `${jobId}.mp3`);

  if (!fs.existsSync(filePath)) {
    deleteJob(jobId);
    throw new NotFoundError("File");
  }

  const filename = job.title ? `${sanitizeFilename(job.title)}.mp3` : `${jobId}.mp3`;

  res.download(filePath, filename, (err) => {
    if (!err) {
      deleteJob(jobId);
      fs.unlink(filePath, () => {});
    }
  });
}