"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class JobsHttpClientV1 extends pip_services3_rpc_node_1.CommandableHttpClient {
    constructor() {
        super('v1/jobs');
    }
    // Add new job
    addJob(correlationId, newJob, callback) {
        this.callCommand('add_job', correlationId, {
            new_job: newJob
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId, newJob, callback) {
        this.callCommand('add_uniq_job', correlationId, {
            new_job: newJob
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Get list of all jobs
    getJobs(correlationId, filter, paging, callback) {
        this.callCommand('get_jobs', correlationId, { filter: filter, paging: paging }, (err, page) => {
            if (page.data.length == 0) {
                callback(err, page);
                return;
            }
            for (let job of page.data) {
                job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
                job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
                job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
                job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            }
            callback(err, page);
        });
    }
    // Start job
    startJob(correlationId, job, callback) {
        this.callCommand('start_job', correlationId, {
            job: job
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Start fist free job by type
    startJobByType(correlationId, jobType, timeout, callback) {
        this.callCommand('start_job_by_type', correlationId, {
            type: jobType,
            timeout: timeout
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, job, callback) {
        this.callCommand('extend_job', correlationId, {
            job: job
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Abort job
    abortJob(correlationId, job, callback) {
        this.callCommand('abort_job', correlationId, {
            job: job
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Compleate job
    compleateJob(correlationId, job, callback) {
        this.callCommand('compleate_job', correlationId, {
            job: job
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Get job by Id
    getJobById(correlationId, jobId, callback) {
        this.callCommand('get_job_by_id', correlationId, {
            job_id: jobId
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Delete job by Id
    deleteJob(correlationId, jobId, callback) {
        this.callCommand('delete_job', correlationId, {
            job_id: jobId
        }, (err, job) => {
            if (job == null) {
                callback(err, job);
                return;
            }
            job.completed = job.completed ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.completed) : null;
            job.started = job.started ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.started) : null;
            job.execute_until = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.execute_until);
            job.locked_until = job.locked_until ? pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.locked_until) : null;
            job.created = pip_services3_commons_node_1.DateTimeConverter.toDateTime(job.created);
            callback(err, job);
        });
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        this.callCommand('delete_jobs', correlationId, null, callback);
    }
}
exports.JobsHttpClientV1 = JobsHttpClientV1;
//# sourceMappingURL=JobsHttpClientV1.js.map