export interface VideoInfo {
    title: string;
    thumbnail: string;
    duration: number;
}
export declare function getInfo(url: string): Promise<VideoInfo>;
export declare function startDownload(url: string, jobId: string): void;
