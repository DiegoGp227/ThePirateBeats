export type JobStatus = "pending" | "downloading" | "done" | "error";
export interface Job {
    status: JobStatus;
    progress: number;
    filePath?: string;
    error?: string;
}
export declare function createJob(jobId: string): void;
export declare function updateJob(jobId: string, data: Partial<Job>): void;
export declare function getJob(jobId: string): Job | undefined;
export declare function deleteJob(jobId: string): void;
