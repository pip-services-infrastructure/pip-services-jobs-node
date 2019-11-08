import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { DirectClient } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

import { JobV1 } from '../../../src/data/version1/JobV1';
import { IJobsClientV1 } from './IJobsClientV1';
import { IJobsController } from '../../../src/logic/IJobsController';
import { NewJobV1 } from '../../../src/data/version1/NewJobV1';

export class JobsDirectClientV1 extends DirectClient<IJobsController> implements IJobsClientV1 {
    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor('jobs', 'controller', '*', '*', '1.0'));
    }
    // Add new job
    public addJob(correlationId: string, newJob: NewJobV1,
        callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.add_job');
        this._controller.addJob(correlationId, newJob, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Add new job if not exist with same type and ref_id
    public addUniqJob(correlationId: string, newJob: NewJobV1,
        callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.add_uniq_job');
        this._controller.addUniqJob(correlationId, newJob, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Get list of all jobs
    public getJobs(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<JobV1>) => void): void {
        let timing = this.instrument(correlationId, 'jobs.get_jobs');
        this._controller.getJobs(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }
    // Start job
    public startJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.start_job');
        this._controller.startJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Extend job execution limit on timeout value
    public extendJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.extend_job');
        this._controller.startJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Abort job
    public abortJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.abort_job');
        this._controller.abortJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Compleate job
    public compleateJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.compleate_job');
        this._controller.compleateJob(correlationId, job, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Get job by Id
    public getJobById(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.get_by_id_job');
        this._controller.getJobById(correlationId, jobId, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Delete job by Id
    public deleteJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        let timing = this.instrument(correlationId, 'jobs.delete_job');
        this._controller.deleteJob(correlationId, jobId, (err, item) => {
            timing.endTiming();
            callback(err, item);
        });
    }
    // Remove all jobs
    public deleteJobs(correlationId: string, callback?: (err: any) => void): void {
        let timing = this.instrument(correlationId, 'jobs.delete_jobs');
        this._controller.deleteJobs(correlationId, (err) => {
            timing.endTiming();
            callback(err);
        });
    }
      // Clean compleated and expiration jobs
    // public cleanJobs(correlationId: string, callback?: (err: any) => void): void {
    //     let timing = this.instrument(correlationId, 'jobs.clean_jobs');
    //     this._controller.deleteJobs(correlationId, (err) => {
    //         timing.endTiming();
    //         callback(err);
    //     });
    // }

}