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
import { IdGenerator } from 'pip-services3-commons-node';
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
    private cleanInterval:number = 1000*60;
    private _logger: CompositeLogger = new CompositeLogger();

    public constructor() {
        this.isOpenFlag = false;
        this._fixeRateTimer = new FixedRateTimer();
    }

    public configure(config: ConfigParams): void {
        this._config = config;
        this._logger.configure(config);
        this.cleanInterval = config.getAsLongWithDefault('options.clean_interval', 1000*60);
    }

    public open(correlationId: string, callback?: (err: any) => void): void {
        this._fixeRateTimer.setCallback(() => {
            this.cleanJobs(correlationId);
        });
        this._fixeRateTimer.setInterval(this.cleanInterval);
        this._fixeRateTimer.start();
        this.isOpenFlag = true;
        this._logger.trace(correlationId, "Jobs controller is opened");
        if (callback)
            callback(null);
    }

    public isOpen(): boolean {
        return this.isOpenFlag;
    }

    public close(correlationId: string, callback?: (err: any) => void): void {
        this._fixeRateTimer.stop();
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
    public startJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void {
        if (job.try_counter > 0) {
            job.lock = true;
            job.started = new Date();
            job.locked_until = new Date(job.started.getUTCMilliseconds() + job.timeout.getUTCMilliseconds());
            job.try_counter = job.try_counter - 1;
            this._persistence.update(correlationId, job, callback);
        } else {
            callback(null, null);
        }
    }
    // Extend job execution limit on timeout value
    public extendJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void {
        job.execute_until = new Date(job.execute_until.getUTCMilliseconds() + job.timeout.getUTCMilliseconds());
        job.locked_until = new Date(job.locked_until.getUTCMilliseconds() + job.timeout.getUTCMilliseconds());
        this._persistence.update(correlationId, job, callback);
    }
    // Abort job
    public abortJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void {
        job.lock = false;
        job.locked_until = undefined;
        job.started = undefined;
        this._persistence.update(correlationId, job, callback);
    }
    // Compleate job
    public compleateJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void {
        job.lock = false;
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
    // Clean compleated and expiration jobs
    public cleanJobs(correlationId: string, callback?: (err: any) => void): void {
        
        this._logger.trace(correlationId, "Jobs controller clean procedure start.");
        //delete all job with 0 try counter
        let filter = FilterParams.fromTuples(
            'try_counter', 0
        );
        this._persistence.deleteByFilter(correlationId, filter, (err) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Jobs controller clean error:");
                callback(err);
            }
        });

        //delete all job with expired execution_time
        filter = FilterParams.fromTuples(
            'execution_time_max', new Date()
        );
        this._persistence.deleteByFilter(correlationId, filter, (err) => {
            if (err != null) {
                this._logger.error(correlationId, err, "Jobs controller clean error:");
                callback(err);
            }
        });

        //delete all job with expired execution_time
        filter = FilterParams.fromTuples(
            'compleated_max', new Date()
        );
        this._persistence.deleteByFilter(correlationId, filter, (err) => {
            if (err!= null) {
                this._logger.error(correlationId, err, "Jobs controller clean error:");     
            }
            this._logger.trace(correlationId, "Jobs controller clean procedure end.");
            callback(err);
        });

    }
}
