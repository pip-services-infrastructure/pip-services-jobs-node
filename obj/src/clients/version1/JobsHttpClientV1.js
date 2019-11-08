"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class JobsHttpClientV1 extends pip_services3_rpc_node_1.CommandableHttpClient {
    constructor() {
        super('v1/jobs');
    }
    // Add new job
    addJob(correlationId, newJob, callback) {
        this.callCommand('add_job', correlationId, {
            new_job: newJob
        }, callback);
    }
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId, newJob, callback) {
        this.callCommand('add_uniq_job', correlationId, {
            new_job: newJob
        }, callback);
    }
    // Get list of all jobs
    getJobs(correlationId, filter, paging, callback) {
        this.callCommand('get_jobs', correlationId, { filter: filter, paging: paging }, callback);
    }
    // Start job
    startJob(correlationId, job, callback) {
        this.callCommand('start_job', correlationId, {
            job: job
        }, callback);
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, job, callback) {
        this.callCommand('extend_job', correlationId, {
            job: job
        }, callback);
    }
    // Abort job
    abortJob(correlationId, job, callback) {
        this.callCommand('abort_job', correlationId, {
            job: job
        }, callback);
    }
    // Compleate job
    compleateJob(correlationId, job, callback) {
        this.callCommand('compleate_job', correlationId, {
            job: job
        }, callback);
    }
    // Get job by Id
    getJobById(correlationId, jobId, callback) {
        this.callCommand('get_job_by_id', correlationId, {
            job_id: jobId
        }, callback);
    }
    // Delete job by Id
    deleteJob(correlationId, jobId, callback) {
        this.callCommand('delete_job', correlationId, {
            job_id: jobId
        }, callback);
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        this.callCommand('delete_jobs', correlationId, null, callback);
    }
}
exports.JobsHttpClientV1 = JobsHttpClientV1;
//# sourceMappingURL=JobsHttpClientV1.js.map