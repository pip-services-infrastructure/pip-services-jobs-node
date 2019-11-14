"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const JobV1_1 = require("../../src/data/version1/JobV1");
const JobsCommandSet_1 = require("./JobsCommandSet");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
class JobsController {
    constructor() {
        this.cleanInterval = 1000 * 60 * 5;
        this.startJobMaxRetries = 10;
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this.isOpenFlag = false;
        this._fixeRateTimer = new pip_services3_commons_node_4.FixedRateTimer();
    }
    configure(config) {
        this._config = config;
        this._logger.configure(config);
        this.cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this.startJobMaxRetries = config.getAsLongWithDefault('options.max_retries', 10);
    }
    open(correlationId, callback) {
        this._fixeRateTimer.setCallback(() => {
            this.cleanJobs(correlationId);
        });
        if (this.cleanInterval > 0) {
            this._fixeRateTimer.setInterval(this.cleanInterval);
            this._fixeRateTimer.start();
        }
        this.isOpenFlag = true;
        this._logger.trace(correlationId, "Jobs controller is opened");
        if (callback)
            callback(null);
    }
    isOpen() {
        return this.isOpenFlag;
    }
    close(correlationId, callback) {
        if (this._fixeRateTimer.isStarted) {
            this._fixeRateTimer.stop();
        }
        this.isOpenFlag = false;
        this._logger.trace(correlationId, "Jobs controller is closed");
        if (callback)
            callback(null);
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_node_3.Descriptor('jobs', 'persistence', '*', '*', '1.0'));
        this._logger.setReferences(references);
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
    startJob(correlationId, job, timeout, callback) {
        let curentDt = new Date();
        if (job.retries < this.startJobMaxRetries &&
            (job.locked_until ? job.locked_until.valueOf() : 0) < curentDt.valueOf() &&
            job.execute_until.valueOf() > curentDt.valueOf()) {
            job.started = curentDt;
            job.locked_until = new Date(job.started.valueOf() + timeout);
            job.retries = job.retries + 1;
            this._persistence.update(correlationId, job, callback);
        }
        else {
            callback(null, null);
        }
    }
    // Start job by type
    startJobByType(correlationId, jobType, timeout, callback) {
        let curentDt = new Date();
        let filter = pip_services3_commons_node_1.FilterParams.fromTuples('type', jobType, 'curent_dt', curentDt, 'max_tries', this.startJobMaxRetries);
        let job = new JobV1_1.JobV1();
        job.started = curentDt;
        job.locked_until = new Date(curentDt.valueOf() + timeout);
        this._persistence.updateJobForStart(correlationId, filter, job, callback);
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, job, timeout, callback) {
        job.locked_until = new Date(job.locked_until.valueOf() + timeout.valueOf());
        if (job.execute_until) {
            job.execute_until = new Date(job.execute_until.valueOf() + timeout.valueOf());
        }
        this._persistence.update(correlationId, job, callback);
    }
    // Abort job
    abortJob(correlationId, job, callback) {
        //job.locked_until = null;
        // stay locked time, next start can be after locked_until expired
        job.started = null;
        this._persistence.update(correlationId, job, callback);
    }
    // Compleate job
    compleateJob(correlationId, job, callback) {
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
    // Clean completed and expiration jobs
    cleanJobs(correlationId, callback) {
        let curentDt = new Date();
        this._logger.trace(correlationId, "Jobs controller clean procedure start.");
        //delete all job with  try counter >= startJobMaxRetries
        //delete all job with expired execution_time
        //delete all job with expired execution_time
        let filter = pip_services3_commons_node_1.FilterParams.fromTuples('criteria', 'or', 'retries_min', this.startJobMaxRetries, 'execute_until_max', curentDt, 'completed_max', curentDt);
        this._persistence.deleteByFilter(correlationId, filter, (err) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Jobs controller clean error:");
            }
            this._logger.trace(correlationId, "Jobs controller clean procedure end.");
            callback(err);
        });
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map