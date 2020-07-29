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
        this._opened = false;
        this._timer = new pip_services3_commons_node_4.FixedRateTimer();
        this._cleanInterval = 1000 * 60 * 5;
        this._maxRetries = 10;
        this._logger = new pip_services3_components_node_1.CompositeLogger();
    }
    configure(config) {
        this._config = config;
        this._logger.configure(config);
        this._cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this._maxRetries = config.getAsLongWithDefault('options.max_retries', 10);
    }
    open(correlationId, callback) {
        this._timer.setCallback(() => {
            this.cleanJobs(correlationId);
        });
        if (this._cleanInterval > 0) {
            this._timer.setInterval(this._cleanInterval);
            this._timer.start();
        }
        this._opened = true;
        this._logger.trace(correlationId, "Jobs controller is opened");
        if (callback)
            callback(null);
    }
    isOpen() {
        return this._opened;
    }
    close(correlationId, callback) {
        if (this._timer.isStarted) {
            this._timer.stop();
        }
        this._opened = false;
        this._logger.trace(correlationId, "Jobs controller is closed");
        if (callback)
            callback(null);
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services3_commons_node_3.Descriptor('pip-services-jobs', 'persistence', '*', '*', '1.0'));
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
    // Get job by Id
    getJobById(correlationId, jobId, callback) {
        this._persistence.getOneById(correlationId, jobId, callback);
    }
    // Start job
    startJobById(correlationId, jobId, timeout, callback) {
        this._persistence.startJobById(correlationId, jobId, timeout, callback);
    }
    // Start job by type
    startJobByType(correlationId, jobType, timeout, callback) {
        this._persistence.startJobByType(correlationId, jobType, timeout, this._maxRetries, callback);
    }
    // Extend job execution limit on timeout value
    extendJob(correlationId, jobId, timeout, callback) {
        let now = new Date();
        let update = pip_services3_commons_node_1.AnyValueMap.fromTuples('locked_until', new Date(now.getTime() + timeout));
        this._persistence.updatePartially(correlationId, jobId, update, callback);
    }
    // Abort job
    abortJob(correlationId, jobId, callback) {
        let update = pip_services3_commons_node_1.AnyValueMap.fromTuples('started', null, 'locked_until', null);
        this._persistence.updatePartially(correlationId, jobId, update, callback);
    }
    // Complete job
    completeJob(correlationId, jobId, callback) {
        let update = pip_services3_commons_node_1.AnyValueMap.fromTuples('started', null, 'locked_until', null, 'completed', new Date());
        this._persistence.updatePartially(correlationId, jobId, update, callback);
    }
    // Delete job by Id
    deleteJobById(correlationId, jobId, callback) {
        this._persistence.deleteById(correlationId, jobId, callback);
    }
    // Remove all jobs
    deleteJobs(correlationId, callback) {
        this._persistence.deleteByFilter(correlationId, new pip_services3_commons_node_1.FilterParams, callback);
    }
    // Clean completed and expiration jobs
    cleanJobs(correlationId, callback) {
        let now = new Date();
        this._logger.trace(correlationId, "Starting jobs cleaning...");
        async.series([
            (callback) => {
                this._persistence.deleteByFilter(correlationId, pip_services3_commons_node_1.FilterParams.fromTuples('min_retries', this._maxRetries), callback);
            },
            (callback) => {
                this._persistence.deleteByFilter(correlationId, pip_services3_commons_node_1.FilterParams.fromTuples('execute_to', now), callback);
            },
            (callback) => {
                this._persistence.deleteByFilter(correlationId, pip_services3_commons_node_1.FilterParams.fromTuples('completed_to', now), callback);
            },
        ], (err) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Failed to clean up jobs.");
            }
            this._logger.trace(correlationId, "Jobs cleaning ended.");
            callback(err);
        });
    }
}
exports.JobsController = JobsController;
//# sourceMappingURL=JobsController.js.map