"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobsNullClientV1 {
    // Add new job
    addJob(correlationId, newJob, callback) {
        callback(null, null);
    }
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId, newJob, callback) {
        callback(null, null);
    }
    // Get list of all jobs
    getJobs(correlationId, filter, paging, callback) {
        callback(null, null);
    }
    // Start job
    startJob(correlationId, job, callback) {
        callback(null, null);
    }
    // Start fist free job by type
    startJobByType(correlationId, jobType, timeout, callback) {
        callback(null, null);
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, job, callback) {
        callback(null, null);
    }
    // Abort job
    abortJob(correlationId, job, callback) {
        callback(null, null);
    }
    // Compleate job
    compleateJob(correlationId, job, callback) {
        callback(null, null);
    }
    // Get job by Id
    getJobById(correlationId, jobId, callback) {
        callback(null, null);
    }
    // Delete job by Id
    deleteJob(correlationId, jobId, callback) {
        callback(null, null);
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        callback(null);
    }
}
exports.JobsNullClientV1 = JobsNullClientV1;
//# sourceMappingURL=JobsNullClientV1.js.map