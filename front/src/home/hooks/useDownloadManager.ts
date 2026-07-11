import { useCallback, useRef } from "react";
import { useDownloadStore } from "@/store/download.store";
import { startDownload as apiStartDownload } from "../services/download.service";
import { BaseURL } from "@/src/shared/constants/urls";
import type { AxiosError } from "axios";

const MAX_RETRIES = 10;
const RETRY_BASE_MS = 2000;

function getAxiosMessage(err: unknown): string | null {
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
  }
  return null;
}

export function useDownloadManager() {
  const currentJob = useDownloadStore((s) => s.currentJob);
  const startDownloadAction = useDownloadStore((s) => s.startDownload);
  const updateProgress = useDownloadStore((s) => s.updateProgress);
  const setDone = useDownloadStore((s) => s.setDone);
  const setError = useDownloadStore((s) => s.setError);
  const esRef = useRef<EventSource | null>(null);

  const startDownload = useCallback(async () => {
    if (!currentJob?.info) return;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const { jobId } = await apiStartDownload(currentJob.url, currentJob.info?.title);
        startDownloadAction(jobId);

        esRef.current?.close();

        const es = new EventSource(`${BaseURL}progress/${jobId}`);
        esRef.current = es;

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === "done" || data.progress >= 100) {
              setDone();
              es.close();
            } else if (data.status === "error") {
              setError(data.error || "Download failed");
              es.close();
            } else {
              updateProgress(data.progress);
            }
          } catch {
            /* ignore parse errors */
          }
        };

        es.onerror = () => {
          setError("Connection lost");
          es.close();
        };

        return;
      } catch (err) {
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, RETRY_BASE_MS * (attempt + 1)));
        } else {
          setError(getAxiosMessage(err) ?? "Failed to start download");
        }
      }
    }
  }, [currentJob?.url, currentJob?.info, startDownloadAction, updateProgress, setDone, setError]);

  return { startDownload, currentJob };
}
