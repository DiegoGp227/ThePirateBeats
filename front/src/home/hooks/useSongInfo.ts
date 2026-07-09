import { useState } from "react";
import { fetchVideoInfo } from "../services/download.service";
import { useDownloadStore } from "@/store/download.store";
import type { VideoInfo } from "../types/download.types";

export function useSongInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setInfo = useDownloadStore((s) => s.setInfo);

  const getInfo = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const info: VideoInfo = await fetchVideoInfo(url);
      setInfo(
        {
          title: info.title,
          thumbnail: info.thumbnail,
          duration: formatDuration(info.duration),
        },
        url
      );
      return info;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching video info";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getInfo, loading, error };
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
