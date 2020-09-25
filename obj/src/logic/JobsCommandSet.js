"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsCommandSet = void 0;
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const NewJobV1Schema_1 = require("../../src/data/version1/NewJobV1Schema");
class JobsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeAddJob());
        this.addCommand(this.makeAddUniqJob());
        this.addCommand(this.makeGetJobs());
        this.addCommand(this.makeGetJobById());
        this.addCommand(this.makeStartJobById());
        this.addCommand(this.makeExtendJob());
        this.addCommand(this.makeAbortJob());
        this.addCommand(this.makeCompleteJob());
        this.addCommand(this.makeDeleteJob());
        this.addCommand(this.makeDeleteJobs());
        //this.addCommand(this.makeCleanJobs());
        this.addCommand(this.makeStartJobByType());
    }
    makeAddJob() {
        return new pip_services3_commons_node_4.Command('add_job', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('new_job', new NewJobV1Schema_1.NewJobV1Schema()), (correlationId, args, callback) => {
            let newJob = args.getAsObject('new_job');
            this._controller.addJob(correlationId, newJob, callback);
        });
    }
    makeAddUniqJob() {
        return new pip_services3_commons_node_4.Command('add_uniq_job', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('new_job', new NewJobV1Schema_1.NewJobV1Schema()), (correlationId, args, callback) => {
            let newJob = args.getAsObject('new_job');
            this._controller.addUniqJob(correlationId, newJob, callback);
        });
    }
    makeGetJobs() {
        return new pip_services3_commons_node_4.Command('get_jobs', new pip_services3_commons_node_5.ObjectSchema(false)
            .withOptionalProperty('filter', new pip_services3_commons_node_6.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_7.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_2.FilterParams.fromValue(args.get('filter'));
            let paging = pip_services3_commons_node_3.PagingParams.fromValue(args.get('paging'));
            this._controller.getJobs(correlationId, filter, paging, callback);
        });
    }
    makeGetJobById() {
        return new pip_services3_commons_node_4.Command('get_job_by_id', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_node_8.TypeCode.String), (correlationId, args, callback) => {
            let jobId = args.getAsString('job_id');
            this._controller.getJobById(correlationId, jobId, callback);
        });
    }
    makeStartJobById() {
        return new pip_services3_commons_node_4.Command('start_job_by_id', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_node_8.TypeCode.String)
            .withRequiredProperty('timeout', pip_services3_commons_node_8.TypeCode.Integer), (correlationId, args, callback) => {
            let jobId = args.getAsString('job_id');
            let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
            this._controller.startJobById(correlationId, jobId, timeout, callback);
        });
    }
    // Start fist free job by type
    makeStartJobByType() {
        return new pip_services3_commons_node_4.Command('start_job_by_type', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('type', pip_services3_commons_node_8.TypeCode.String)
            .withRequiredProperty('timeout', pip_services3_commons_node_8.TypeCode.Integer), (correlationId, args, callback) => {
            let type = args.getAsString('type');
            let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
            this._controller.startJobByType(correlationId, type, timeout, callback);
        });
    }
    makeExtendJob() {
        return new pip_services3_commons_node_4.Command('extend_job', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_node_8.TypeCode.String)
            .withRequiredProperty('timeout', pip_services3_commons_node_8.TypeCode.Integer), (correlationId, args, callback) => {
            let jobId = args.getAsString('job_id');
            let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
            this._controller.extendJob(correlationId, jobId, timeout, callback);
        });
    }
    makeAbortJob() {
        return new pip_services3_commons_node_4.Command('abort_job', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_node_8.TypeCode.String), (correlationId, args, callback) => {
            let jobId = args.getAsString('job_id');
            this._controller.abortJob(correlationId, jobId, callback);
        });
    }
    makeCompleteJob() {
        return new pip_services3_commons_node_4.Command('complete_job', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_node_8.TypeCode.String), (correlationId, args, callback) => {
            let jobId = args.getAsString('job_id');
            this._controller.completeJob(correlationId, jobId, callback);
        });
    }
    makeDeleteJob() {
        return new pip_services3_commons_node_4.Command('delete_job_by_id', new pip_services3_commons_node_5.ObjectSchema(false)
            .withRequiredProperty('job_id', pip_services3_commons_node_8.TypeCode.String), (correlationId, args, callback) => {
            let jobId = args.getAsString('job_id');
            this._controller.deleteJobById(correlationId, jobId, callback);
        });
    }
    makeDeleteJobs() {
        return new pip_services3_commons_node_4.Command('delete_jobs', new pip_services3_commons_node_5.ObjectSchema(true), (correlationId, args, callback) => {
            this._controller.deleteJobs(correlationId, (err) => {
                callback(err, null);
            });
        });
    }
}
exports.JobsCommandSet = JobsCommandSet;
//# sourceMappingURL=JobsCommandSet.js.map