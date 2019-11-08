"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class JobsDirectClientV1 extends pip_services3_rpc_node_1.DirectClient {
    constructor() {
        super();
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('jobs', 'controller', '*', '*', '1.0'));
    }
    // Add new job
    addJob(correlationId, newJob, callback) {
        let timing = this.instrument(correlationId, 'jobs.add_job');
        this._controller.addJob(correlationId, newJob, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId, newJob, callback) {
        let timing = this.instrument(correlationId, 'jobs.add_uniq_job');
        this._controller.addUniqJob(correlationId, newJob, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Get list of all jobs
    getJobs(correlationId, filter, paging, callback) {
        let timing = this.instrument(correlationId, 'jobs.get_jobs');
        this._controller.getJobs(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }
    // Start job
    startJob(correlationId, job, callback) {
        let timing = this.instrument(correlationId, 'jobs.start_job');
        this._controller.startJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, job, callback) {
        let timing = this.instrument(correlationId, 'jobs.extend_job');
        this._controller.startJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Abort job
    abortJob(correlationId, job, callback) {
        let timing = this.instrument(correlationId, 'jobs.abort_job');
        this._controller.abortJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Compleate job
    compleateJob(correlationId, job, callback) {
        let timing = this.instrument(correlationId, 'jobs.compleate_job');
        this._controller.compleateJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Get job by Id
    getJobById(correlationId, jobId, callback) {
        let timing = this.instrument(correlationId, 'jobs.get_by_id_job');
        this._controller.getJobById(correlationId, jobId, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Delete job by Id
    deleteJob(correlationId, jobId, callback) {
        let timing = this.instrument(correlationId, 'jobs.delete_job');
        this._controller.deleteJob(correlationId, jobId, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        let timing = this.instrument(correlationId, 'jobs.delete_jobs');
        this._controller.deleteJobs(correlationId, (err) => {
            timing.endTiming();
            callback(err);
        });
    }
}
exports.JobsDirectClientV1 = JobsDirectClientV1;
//# sourceMappingURL=JobsDirectClientV1.js.map