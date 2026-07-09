import apiClient from "@/src/shared/services/apiClient";
import type { VideoInfo, DownloadResponse } from "../types/download.types";

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const { data } = await apiClient.post<VideoInfo>("info", { url });
  return data;
}

export async function startDownload(url: string): Promise<DownloadResponse> {
  const { data } = await apiClient.post<DownloadResponse>("download", { url });
  return data;
}
