const jobs = new Map();
export function createJob(jobId) {
    jobs.set(jobId, { status: "pending", progress: 0 });
}
export function updateJob(jobId, data) {
    const current = jobs.get(jobId);
    if (!current)
        return;
    jobs.set(jobId, { ...current, ...data });
}
export function getJob(jobId) {
    return jobs.get(jobId);
}
export function deleteJob(jobId) {
    jobs.delete(jobId);
}
//# sourceMappingURL=jobs.store.js.map