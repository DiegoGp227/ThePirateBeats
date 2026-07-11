import { useState } from "react";
import { fetchVideoInfo } from "../services/download.service";
import { useDownloadStore } from "@/store/download.store";
import { useCacheStore } from "@/store/cache.store";
import { formatTime } from "@/src/shared/utils/formatTime";
import type { VideoInfo } from "../types/download.types";
import type { AxiosError } from "axios";

const MAX_RETRIES = 10;
const RETRY_BASE_MS = 2000;

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
  }
  return err instanceof Error ? err.message : "Error fetching video info";
}

export function useSongInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setInfo = useDownloadStore((s) => s.setInfo);
  const pushSong = useCacheStore((s) => s.pushSong);

  const getInfo = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const info: VideoInfo = await fetchVideoInfo(url);
      const song = {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: formatTime(info.duration),
      };
      setInfo(song, url);
      pushSong(song, url);
      return info;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getInfo, loading, error };
}

