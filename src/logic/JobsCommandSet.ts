let _ = require('lodash');

import { CommandSet } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';

import { NewJobV1Schema } from '../../src/data/version1/NewJobV1Schema';
import { IJobsController } from '../../src/logic/IJobsController';
import { NewJobV1 } from '../data/version1/NewJobV1';

export class JobsCommandSet extends CommandSet {
    private _controller: IJobsController;

    constructor(controller: IJobsController) {
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
        this.addCommand(this.makeCleanJobs());
        this.addCommand(this.makeStartJobByType());
    }

    private makeAddJob(): ICommand {
        return new Command(
            'add_job',
            new ObjectSchema(false)
                .withRequiredProperty('new_job', new NewJobV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let newJob: NewJobV1 = args.getAsObject('new_job');
                this._controller.addJob(correlationId, newJob, callback);
            }
        );
    }

    private makeAddUniqJob(): ICommand {
        return new Command(
            'add_uniq_job',
            new ObjectSchema(false)
                .withRequiredProperty('new_job', new NewJobV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let newJob: NewJobV1 = args.getAsObject('new_job');
                this._controller.addUniqJob(correlationId, newJob, callback);
            }
        );
    }

    private makeGetJobs(): ICommand {
        return new Command(
            'get_jobs',
            new ObjectSchema(false)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get('filter'));
                let paging = PagingParams.fromValue(args.get('paging'));
                this._controller.getJobs(correlationId, filter, paging, callback);
            }
        );
    }

    private makeGetJobById(): ICommand {
        return new Command(
            'get_job_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let jobId = args.getAsString('job_id');
                this._controller.getJobById(correlationId, jobId, callback);
            }
        );
    }

    private makeStartJobById(): ICommand {
        return new Command(
            'start_job_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String)
                .withRequiredProperty('timeout', TypeCode.Integer),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let jobId = args.getAsString('job_id');
                let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
                this._controller.startJobById(correlationId, jobId, timeout, callback);
            }
        );
    }

    // Start fist free job by type
    private makeStartJobByType(): ICommand {
        return new Command(
            'start_job_by_type',
            new ObjectSchema(false)
                .withRequiredProperty('type', TypeCode.String)
                .withRequiredProperty('timeout', TypeCode.Integer),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let type = args.getAsString('type');
                let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
                this._controller.startJobByType(correlationId, type, timeout, callback);
            }
        );
    }

    private makeExtendJob(): ICommand {
        return new Command(
            'extend_job',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String)
                .withRequiredProperty('timeout', TypeCode.Integer),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let jobId = args.getAsString('job_id');
                let timeout = args.getAsIntegerWithDefault('timeout', 1000 * 60);
                this._controller.extendJob(correlationId, jobId, timeout, callback);
            }
        );
    }

    private makeAbortJob(): ICommand {
        return new Command(
            'abort_job',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let jobId = args.getAsString('job_id');
                this._controller.abortJob(correlationId, jobId, callback);
            }
        );
    }

    private makeCompleteJob(): ICommand {
        return new Command(
            'complete_job',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let jobId = args.getAsString('job_id');
                this._controller.completeJob(correlationId, jobId, callback);
            }
        );
    }

    private makeDeleteJob(): ICommand {
        return new Command(
            'delete_job_by_id',
            new ObjectSchema(false)
                .withRequiredProperty('job_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let jobId: string = args.getAsString('job_id');
                this._controller.deleteJobById(correlationId, jobId, callback);
            }
        );
    }

    private makeDeleteJobs(): ICommand {
        return new Command(
            'delete_jobs',
            new ObjectSchema(true),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                this._controller.deleteJobs(correlationId, (err) => {
                    callback(err, null);
                });
            }
        );
    }

    private makeCleanJobs(): ICommand {
        return new Command(
            'clean_jobs',
            new ObjectSchema(true),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                this._controller.cleanJobs(correlationId, (err) => {
                    callback(err, null);
                });
            }
        );
    }
}