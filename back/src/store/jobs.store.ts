export type JobStatus = "pending" | "downloading" | "done" | "error";

export interface Job {
  status: JobStatus;
  progress: number;
  filePath?: string;
  error?: string;
}

const jobs = new Map<string, Job>();

export function createJob(jobId: string) {
  jobs.set(jobId, { status: "pending", progress: 0 });
}

export function updateJob(jobId: string, data: Partial<Job>) {
  const current = jobs.get(jobId);
  if (!current) return;
  jobs.set(jobId, { ...current, ...data });
}

export function getJob(jobId: string): Job | undefined {
  return jobs.get(jobId);
}

export function deleteJob(jobId: string) {
  jobs.delete(jobId);
}