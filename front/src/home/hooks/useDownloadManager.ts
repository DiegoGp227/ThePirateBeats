import { useCallback, useRef } from "react";
import { useDownloadStore } from "@/store/download.store";
import { startDownload as apiStartDownload } from "../services/download.service";
import { BaseURL } from "@/src/shared/constants/urls";

export function useDownloadManager() {
  const currentJob = useDownloadStore((s) => s.currentJob);
  const startDownloadAction = useDownloadStore((s) => s.startDownload);
  const updateProgress = useDownloadStore((s) => s.updateProgress);
  const setDone = useDownloadStore((s) => s.setDone);
  const setError = useDownloadStore((s) => s.setError);
  const esRef = useRef<EventSource | null>(null);

  const startDownload = useCallback(async () => {
    if (!currentJob?.info) return;

    try {
      const { jobId } = await apiStartDownload(currentJob.url);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start download";
      setError(message);
    }
  }, [currentJob?.url, currentJob?.info, startDownloadAction, updateProgress, setDone, setError]);

  return { startDownload, currentJob };
}
