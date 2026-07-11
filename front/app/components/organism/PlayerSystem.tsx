"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDownloadStore } from "@/store/download.store";
import { useDownloadManager } from "@/src/home/hooks/useDownloadManager";
import { useAudioPlayer } from "@/src/home/hooks/useAudioPlayer";
import { formatTime } from "@/src/shared/utils/formatTime";
import { BaseURL } from "@/src/shared/constants/urls";

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block border-2 border-text border-t-red-light rounded-full animate-spin ${className}`}
    />
  );
}

export default function PlayerSystem() {
  const currentJob = useDownloadStore((s) => s.currentJob);
  const { startDownload } = useDownloadManager();

  const isDownloading = currentJob?.status === "downloading";
  const isDone = currentJob?.status === "done";
  const isError = currentJob?.status === "error";

  const fileUrl = currentJob?.jobId ? `${BaseURL}file/${currentJob.jobId}` : "";

  const { playing, progress, duration, togglePlay } = useAudioPlayer(fileUrl, isDone);

  useEffect(() => {
    if (currentJob?.status === "pending" || currentJob?.status === "idle") {
      if (currentJob?.url && currentJob?.info) {
        startDownload();
      }
    }
  }, [currentJob?.status, currentJob?.url, currentJob?.info, startDownload]);

  const fileReady = isDone && duration > 0;
  const showLoader = !fileReady && !isError;

  const progressWidth = fileReady
    ? duration > 0 ? (progress / duration) * 100 : 0
    : currentJob?.progress ?? 0;

  const timeDisplay = fileReady
    ? `${formatTime(progress)} / ${formatTime(duration)}`
    : isDownloading
      ? `Downloading ${Math.round(currentJob?.progress ?? 0)}%`
      : isDone
        ? "Loading audio..."
        : "—";

  if (!currentJob?.info) return null;

  return (
    <div className="max-w-240 w-full border border-border-dim">
      <div className="bg-surface px-3 py-1 w-full flex justify-between items-center">
        <span className="text-text-dim text-xs tracking-widest uppercase">▶ now playing</span>
        <span className="text-red-dim text-[0.55rem] font-mono">[ player://0x1f ]</span>
      </div>
      <div className="bg-bg-white p-5 border-t border-border-dim">
        <div className="flex items-center gap-4 mb-4">
          {fileReady ? (
            <button
              onClick={togglePlay}
              className="w-10 h-10 shrink-0 border border-border bg-black text-text hover:border-red-dim hover:text-red-light flex items-center justify-center text-sm transition-all duration-150"
            >
              {playing ? "⏸" : "▶"}
            </button>
          ) : showLoader ? (
            <div className="w-10 h-10 shrink-0 border border-border bg-black flex items-center justify-center">
              <Spinner className="w-5 h-5" />
            </div>
          ) : null}
          {currentJob.info.thumbnail ? (
            <div className="w-10 h-10 shrink-0 overflow-hidden border border-border">
              <Image
                src={currentJob.info.thumbnail}
                alt={currentJob.info.title}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-10 h-10 shrink-0 border border-border bg-black flex items-center justify-center text-red-dim text-sm">
              ♪
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-text-bright text-sm font-normal truncate">{currentJob.info.title}</h3>
            <span className="text-text-dim text-[0.6rem] uppercase tracking-wider">
              {currentJob.info.author || currentJob.info.duration}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="h-0.75 bg-black border border-border relative">
              <div
                className="h-full bg-red-light transition-all duration-200"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
          <span className="text-text-dim text-[0.6rem] font-mono min-w-22.5 text-right">
            {timeDisplay}
          </span>
          {fileReady && fileUrl && (
            <a
              href={fileUrl}
              download
              className="w-8 h-8 shrink-0 border border-border bg-black text-text hover:border-red-dim hover:text-red-light flex items-center justify-center text-sm transition-all duration-150 no-underline"
            >
              ↓
            </a>
          )}
        </div>
        {isError && currentJob.error && (
          <p className="text-red-bright text-xs mt-2">{currentJob.error}</p>
        )}
      </div>
    </div>
  );
}
