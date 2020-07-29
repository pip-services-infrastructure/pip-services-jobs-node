let _ = require('lodash');
let async = require('async');

import { FilterParams, IOpenable, AnyValueMap } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';

import { JobV1 } from '../../src/data/version1/JobV1';
import { IJobsPersistence } from '../../src/persistence/IJobsPersistence';
import { IJobsController } from './IJobsController';
import { JobsCommandSet } from './JobsCommandSet';
import { NewJobV1 } from '../data/version1/NewJobV1';
import { FixedRateTimer } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';

export class JobsController implements IJobsController, IConfigurable, IReferenceable, ICommandable, IOpenable {
    private _persistence: IJobsPersistence;
    private _commandSet: JobsCommandSet;
    private _opened: boolean = false;
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _config: ConfigParams;
    private _cleanInterval: number = 1000 * 60 * 5;
    private _maxRetries = 10;
    private _logger: CompositeLogger = new CompositeLogger();

    public constructor() {
    }

    public configure(config: ConfigParams): void {
        this._config = config;
        this._logger.configure(config);
        this._cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this._maxRetries = config.getAsLongWithDefault('options.max_retries', 10);
    }

    public open(correlationId: string, callback?: (err: any) => void): void {
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

    public isOpen(): boolean {
        return this._opened;
    }

    public close(correlationId: string, callback?: (err: any) => void): void {
        if (this._timer.isStarted) {
            this._timer.stop();
        }
        this._opened = false;
        this._logger.trace(correlationId, "Jobs controller is closed");
        if (callback)
            callback(null);
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IJobsPersistence>(
            new Descriptor('pip-services-jobs', 'persistence', '*', '*', '1.0')
        );
        this._logger.setReferences(references);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new JobsCommandSet(this);
        }
        return this._commandSet;
    }
    
    // Add new job
    public addJob(correlationId: string, newJob: NewJobV1, callback: (err: any, job: JobV1) => void): void {
        let job = new JobV1(newJob);
        this._persistence.create(correlationId, job, callback);
    }

    // Add new job if not exist with same type and ref_id
    public addUniqJob(correlationId: string, newJob: NewJobV1, callback: (err: any, job: JobV1) => void): void {
        let filter = FilterParams.fromTuples(
            'type', newJob.type,
            'ref_id', newJob.ref_id
        );
        let paging = new PagingParams();
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            if (page.data.length > 0) {
                callback(err, page.data[0]);
            } else {
                let job = new JobV1(newJob);
                this._persistence.create(correlationId, job, callback);
            }
        });
    }
    
    // Get list of all jobs
    public getJobs(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<JobV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    // Get job by Id
    public getJobById(correlationId: string, jobId: string, callback: (err: any, page: JobV1) => void): void {
        this._persistence.getOneById(correlationId, jobId, callback);
    }

    // Start job
    public startJobById(correlationId: string, jobId: string, timeout:number, callback: (err: any, job: JobV1) => void): void {
        this._persistence.startJobById(correlationId, jobId, timeout, callback);
    }

    // Start job by type
    startJobByType(correlationId: string, jobType: string, timeout: number, callback: (err: any, job: JobV1) => void): void {
        this._persistence.startJobByType(correlationId, jobType, timeout, this._maxRetries, callback);
    }

    // Extend job execution limit on timeout value
    public extendJob(correlationId: string, jobId: string, timeout: number, callback: (err: any, job: JobV1) => void): void {
        let now = new Date();
        let update = AnyValueMap.fromTuples(
            'locked_until', new Date(now.getTime() + timeout)
        );
        this._persistence.updatePartially(correlationId, jobId, update, callback);
    }

    // Abort job
    public abortJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        let update = AnyValueMap.fromTuples(
            'started', null,
            'locked_until', null,
        );
        this._persistence.updatePartially(correlationId, jobId, update, callback);
    }
    
    // Complete job
    public completeJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        let update = AnyValueMap.fromTuples(
            'started', null,
            'locked_until', null,
            'completed', new Date()
        );
        this._persistence.updatePartially(correlationId, jobId, update, callback);
    }

    // Delete job by Id
    public deleteJobById(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        this._persistence.deleteById(correlationId, jobId, callback);
    }

    // Remove all jobs
    public deleteJobs(correlationId: string, callback?: (err: any) => void): void {
        this._persistence.deleteByFilter(correlationId, new FilterParams, callback);
    }

    // Clean completed and expiration jobs
    public cleanJobs(correlationId: string, callback?: (err: any) => void): void {
        let now = new Date();

        this._logger.trace(correlationId, "Starting jobs cleaning...");

        async.series([
            (callback) => {
                this._persistence.deleteByFilter(
                    correlationId,
                    FilterParams.fromTuples(
                        'min_retries', this._maxRetries
                    ),
                    callback
                );        
            },
            (callback) => {
                this._persistence.deleteByFilter(
                    correlationId,
                    FilterParams.fromTuples(
                        'execute_to', now
                    ),
                    callback
                );        
            },
            (callback) => {
                this._persistence.deleteByFilter(
                    correlationId,
                    FilterParams.fromTuples(
                        'completed_to', now
                    ),
                    callback
                );        
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
