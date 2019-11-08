"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const JobV1_1 = require("../../src/data/version1/JobV1");
const JobsCommandSet_1 = require("./JobsCommandSet");
class JobsController {
    constructor() { }
    configure(config) {
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_node_3.Descriptor('jobs', 'persistence', '*', '*', '1.0'));
    }
    getCommandSet() {
        if (this._commandSet == null) {
            this._commandSet = new JobsCommandSet_1.JobsCommandSet(this);
        }
        return this._commandSet;
    }
    // Add new job
    addJob(correlationId, newJob, callback) {
        let job = new JobV1_1.JobV1(newJob);
        this._persistence.create(correlationId, job, callback);
    }
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId, newJob, callback) {
        let filter = pip_services3_commons_node_1.FilterParams.fromTuples('type', newJob.type, 'ref_id', newJob.ref_id);
        let paging = new pip_services3_commons_node_2.PagingParams();
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (page.data.length > 0) {
                callback(err, page.data[0]);
            }
            else {
                let job = new JobV1_1.JobV1(newJob);
                this._persistence.create(correlationId, job, callback);
            }
        });
    }
    // Get list of all jobs
    getJobs(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    // Start job
    startJob(correlationId, job, callback) {
        if (job.try_counter > 0) {
            job.lock = true;
            job.started = new Date();
            job.locked_until = new Date(job.started.getUTCMilliseconds() + job.timeout.getUTCMilliseconds());
            job.try_counter = job.try_counter - 1;
            this._persistence.update(correlationId, job, callback);
        }
        else {
            callback(null, null);
        }
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, job, callback) {
        job.execute_until = new Date(job.execute_until.getUTCMilliseconds() + job.timeout.getUTCMilliseconds());
        job.locked_until = new Date(job.locked_until.getUTCMilliseconds() + job.timeout.getUTCMilliseconds());
        this._persistence.update(correlationId, job, callback);
    }
    // Abort job
    abortJob(correlationId, job, callback) {
        job.lock = false;
        job.locked_until = null;
        job.started = null;
        this._persistence.update(correlationId, job, callback);
    }
    // Compleate job
    compleateJob(correlationId, job, callback) {
        job.lock = false;
        job.completed = new Date();
        this._persistence.update(correlationId, job, callback);
    }
    // Get job by Id
    getJobById(correlationId, jobId, callback) {
        this._persistence.getOneById(correlationId, jobId, callback);
    }
    // Delete job by Id
    deleteJob(correlationId, jobId, callback) {
        this._persistence.deleteById(correlationId, jobId, callback);
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        this._persistence.deleteByFilter(correlationId, new pip_services3_commons_node_1.FilterParams, callback);
    }
    // Clean compleated and expiration jobs
    cleanJobs(correlationId, callback) {
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map