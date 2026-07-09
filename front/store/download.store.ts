import { create } from "zustand";

export type DownloadStatus = "idle" | "pending" | "downloading" | "done" | "error";

export interface SongInfo {
  title: string;
  thumbnail: string;
  duration: string;
  author?: string;
}

export interface DownloadJob {
  jobId: string;
  url: string;
  status: DownloadStatus;
  progress: number;
  info: SongInfo | null;
  error?: string;
}

interface DownloadStore {
  currentJob: DownloadJob | null;
  history: DownloadJob[];

  setInfo: (info: SongInfo, url: string) => void;
  selectSong: (info: SongInfo, url?: string) => void;
  startDownload: (jobId: string) => void;
  updateProgress: (progress: number) => void;
  setDone: () => void;
  setError: (error: string) => void;
  addToHistory: (job: DownloadJob) => void;
  reset: () => void;
}

export const useDownloadStore = create<DownloadStore>((set) => ({
  currentJob: null,
  history: [],

  setInfo: (info, url) =>
    set({
      currentJob: {
        jobId: "",
        url,
        status: "pending",
        progress: 0,
        info,
      },
    }),

  selectSong: (info, url) =>
    set({
      currentJob: {
        jobId: "",
        url: url ?? "",
        status: "idle",
        progress: 0,
        info,
      },
    }),

  startDownload: (jobId) =>
    set((state) => ({
      currentJob: state.currentJob
        ? { ...state.currentJob, jobId, status: "downloading" as const, progress: 0 }
        : null,
    })),

  updateProgress: (progress) =>
    set((state) => ({
      currentJob: state.currentJob
        ? { ...state.currentJob, progress }
        : null,
    })),

  setDone: () =>
    set((state) => {
      if (!state.currentJob) return {};
      const done = { ...state.currentJob, status: "done" as const, progress: 100 };
      return {
        currentJob: done,
        history: [done, ...state.history],
      };
    }),

  setError: (error) =>
    set((state) => ({
      currentJob: state.currentJob
        ? { ...state.currentJob, status: "error" as const, error }
        : null,
    })),

  addToHistory: (job) =>
    set((state) => ({
      history: [job, ...state.history],
    })),

  reset: () => set({ currentJob: null }),
}));
