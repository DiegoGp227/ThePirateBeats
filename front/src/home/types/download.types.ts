export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
}

export interface DownloadResponse {
  jobId: string;
}

export interface ProgressEvent {
  status: string;
  progress: number;
  error?: string;
}
