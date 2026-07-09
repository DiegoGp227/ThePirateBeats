import apiClient from "@/src/shared/services/apiClient";
import { InfoURL, DownloadURL } from "@/src/shared/constants/urls";
import type { VideoInfo, DownloadResponse } from "../types/download.types";

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const { data } = await apiClient.post<VideoInfo>(InfoURL.pathname, { url });
  return data;
}

export async function startDownload(url: string): Promise<DownloadResponse> {
  const { data } = await apiClient.post<DownloadResponse>(DownloadURL.pathname, { url });
  return data;
}
