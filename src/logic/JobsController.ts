let _ = require('lodash');
let async = require('async');

import { FilterParams, IOpenable } from 'pip-services3-commons-node';
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
    private isOpenFlag: boolean;
    private _fixeRateTimer: FixedRateTimer;
    private _config: ConfigParams;
    private cleanInterval: number = 1000 * 60 * 5;
    private startJobMaxRetries = 10;
    private _logger: CompositeLogger = new CompositeLogger();

    public constructor() {
        this.isOpenFlag = false;
        this._fixeRateTimer = new FixedRateTimer();
    }

    public configure(config: ConfigParams): void {
        this._config = config;
        this._logger.configure(config);
        this.cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000 * 60);
        this.startJobMaxRetries = config.getAsLongWithDefault('options.max_retries', 10);
    }

    public open(correlationId: string, callback?: (err: any) => void): void {
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

    public isOpen(): boolean {
        return this.isOpenFlag;
    }

    public close(correlationId: string, callback?: (err: any) => void): void {
        if (this._fixeRateTimer.isStarted) {
            this._fixeRateTimer.stop();
        }
        this.isOpenFlag = false;
        this._logger.trace(correlationId, "Jobs controller is closed");
        if (callback)
            callback(null);
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IJobsPersistence>(
            new Descriptor('jobs', 'persistence', '*', '*', '1.0')
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
    // Start job
    public startJob(correlationId: string, job: JobV1, timeout:number, callback: (err: any, job: JobV1) => void): void {
        let curentDt = new Date();
        if (job.retries < this.startJobMaxRetries &&
            (job.locked_until ? job.locked_until.valueOf() : 0) < curentDt.valueOf() &&
            job.execute_until.valueOf() > curentDt.valueOf()) {
            job.started = curentDt;
            job.locked_until = new Date(job.started.valueOf() + timeout);
            job.retries = job.retries + 1;
            this._persistence.update(correlationId, job, callback);
        } else {
            callback(null, null);
        }
    }

    // Start job by type
    startJobByType(correlationId: string, jobType: string, timeout: number, callback: (err: any, job: JobV1) => void): void {
        let curentDt = new Date();
        let filter = FilterParams.fromTuples(
            'type', jobType,
            'curent_dt', curentDt,
            'max_tries', this.startJobMaxRetries
        );
        let job = new JobV1();
        job.started = curentDt;
        job.locked_until = new Date(curentDt.valueOf() + timeout);
        this._persistence.updateJobForStart(correlationId, filter, job, callback);
    }

    // Extend job execution limit on timeout value
    public extendJob(correlationId: string, job: JobV1, timeout:number, callback: (err: any, job: JobV1) => void): void {
        job.locked_until = new Date(job.locked_until.valueOf() +timeout.valueOf());
        if (job.execute_until) { 
            job.execute_until = new Date(job.execute_until.valueOf() + timeout.valueOf());
        }
        this._persistence.update(correlationId, job, callback);
    }
    // Abort job
    public abortJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void {
        //job.locked_until = null;
        // stay locked time, next start can be after locked_until expired
        job.started = null;
        this._persistence.update(correlationId, job, callback);
    }
    // Compleate job
    public compleateJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void {
        
        job.completed = new Date();
        this._persistence.update(correlationId, job, callback);
    }
    // Get job by Id
    public getJobById(correlationId: string, jobId: string, callback: (err: any, page: JobV1) => void): void {
        this._persistence.getOneById(correlationId, jobId, callback);
    }
    // Delete job by Id
    public deleteJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        this._persistence.deleteById(correlationId, jobId, callback);
    }
    // Remove all jobs
    public deleteJobs(correlationId: string, callback?: (err: any) => void): void {
        this._persistence.deleteByFilter(correlationId, new FilterParams, callback);
    }
    // Clean completed and expiration jobs
    public cleanJobs(correlationId: string, callback?: (err: any) => void): void {

        let curentDt = new Date();

        this._logger.trace(correlationId, "Jobs controller clean procedure start.");
        //delete all job with  try counter >= startJobMaxRetries
        //delete all job with expired execution_time
        //delete all job with expired execution_time
        let filter = FilterParams.fromTuples(
            'criteria', 'or',
            'retries_min', this.startJobMaxRetries,
            'execute_until_max', curentDt,
            'completed_max', curentDt
        );
        this._persistence.deleteByFilter(correlationId, filter, (err) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Jobs controller clean error:");
            }
            this._logger.trace(correlationId, "Jobs controller clean procedure end.");
            callback(err);
        });

    }
}
