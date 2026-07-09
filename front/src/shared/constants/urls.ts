export const BaseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/";

export const InfoURL = new URL("info", BaseURL);
export const DownloadURL = new URL("download", BaseURL);
export const ProgressURL = (jobId: string) => new URL(`progress/${jobId}`, BaseURL);
export const FileURL = (jobId: string) => new URL(`file/${jobId}`, BaseURL);
