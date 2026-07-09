"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDownloadStore } from "@/store/download.store";
import { useDownloadManager } from "@/src/home/hooks/useDownloadManager";
import { BaseURL } from "@/src/shared/constants/urls";

export default function PlayerSistem() {
  const currentJob = useDownloadStore((s) => s.currentJob);
  const { startDownload } = useDownloadManager();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const isDownloading = currentJob?.status === "downloading";
  const isPending = currentJob?.status === "pending" || currentJob?.status === "idle";
  const isDone = currentJob?.status === "done";
  const isError = currentJob?.status === "error";

  const fileUrl = currentJob?.jobId ? `${BaseURL}/file/${currentJob.jobId}` : "";

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isDone && fileUrl) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = fileUrl;
      audio.load();
      setPlaying(false);
      setAudioProgress(0);
    }
  }, [isDone, fileUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
    };
    const onLoadedMeta = () => {
      setAudioDuration(audio.duration);
    };
    const onEnded = () => {
      setPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isDone, fileUrl]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressWidth = isDone
    ? audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0
    : currentJob?.progress ?? 0;

  const timeDisplay = isDone
    ? `${formatTime(audioProgress)} / ${formatTime(audioDuration)}`
    : currentJob?.status === "downloading"
      ? `Downloading ${Math.round(currentJob?.progress ?? 0)}%`
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
          {isDone ? (
            <button
              onClick={togglePlay}
              className="w-8 h-8 shrink-0 border border-border bg-black text-text hover:border-red-dim hover:text-red-light flex items-center justify-center text-sm transition-all duration-150"
            >
              {playing ? "⏸" : "▶"}
            </button>
          ) : (
            <button
              onClick={startDownload}
              disabled={isDownloading}
              className="w-8 h-8 shrink-0 border border-border bg-black text-text hover:border-red-dim hover:text-red-light flex items-center justify-center text-sm transition-all duration-150 disabled:opacity-40"
            >
              ↓
            </button>
          )}
          <div className="flex-1 relative">
            <div className="h-[3px] bg-black border border-border relative">
              <div
                className="h-full bg-red-light transition-all duration-200"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
          <span className="text-text-dim text-[0.6rem] font-mono min-w-[90px] text-right">
            {timeDisplay}
          </span>
          {isDone && fileUrl && (
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
