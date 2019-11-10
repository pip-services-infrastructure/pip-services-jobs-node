let _ = require('lodash');
import { FilterParams, DateTimeConverter } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { CommandableHttpClient } from 'pip-services3-rpc-node';

import { JobV1 } from '../../../src/data/version1/JobV1';
import { IJobsClientV1 } from './IJobsClientV1';
import { NewJobV1 } from '../..';

export class JobsHttpClientV1 extends CommandableHttpClient implements IJobsClientV1 {
    public constructor() {
        super('v1/jobs');
    }

    // Add new job
    public addJob(correlationId: string, newJob: NewJobV1,
        callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'add_job',
            correlationId,
            {
                new_job: newJob
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Add new job if not exist with same type and ref_id
    public addUniqJob(correlationId: string, newJob: NewJobV1,
        callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'add_uniq_job',
            correlationId,
            {
                new_job: newJob
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }

        );
    }
    // Get list of all jobs
    public getJobs(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<JobV1>) => void): void {
        this.callCommand(
            'get_jobs',
            correlationId,
            { filter: filter, paging: paging },
            (err, page) => {
                if (page.data.length == 0) {
                    callback(err, page);
                    return;
                }
                for (let job of page.data) {
                    job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                    job.timeout = DateTimeConverter.toDateTime(job.timeout);
                    job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                    job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                    job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                    job.created = DateTimeConverter.toDateTime(job.created);
                }
                callback(err, page);
            }
        );
    }
    // Start job
    public startJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'start_job',
            correlationId,
            {
                job: job
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Extend job execution limit on timeout value
    public extendJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'extend_job',
            correlationId,
            {
                job: job
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Abort job
    public abortJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'abort_job',
            correlationId,
            {
                job: job
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Compleate job
    public compleateJob(correlationId: string, job: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'compleate_job',
            correlationId,
            {
                job: job
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Get job by Id
    public getJobById(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'get_job_by_id',
            correlationId,
            {
                job_id: jobId
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Delete job by Id
    public deleteJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void {
        this.callCommand(
            'delete_job',
            correlationId,
            {
                job_id: jobId
            }, (err, job) => {
                if (job == null) {
                    callback(err, job);
                    return;
                }
                job.completed = _.isUndefined(job.completed) ? undefined : DateTimeConverter.toDateTime(job.completed);
                job.timeout = DateTimeConverter.toDateTime(job.timeout);
                job.started = _.isUndefined(job.started) ? undefined : DateTimeConverter.toDateTime(job.started);
                job.execute_until = DateTimeConverter.toDateTime(job.execute_until);
                job.locked_until = _.isUndefined(job.locked_until) ? undefined : DateTimeConverter.toDateTime(job.locked_until);
                job.created = DateTimeConverter.toDateTime(job.created);
                callback(err, job);
            }
        );
    }
    // Remove all jobs
    public deleteJobs(correlationId: string, callback?: (err: any) => void): void {
        this.callCommand(
            'delete_jobs',
            correlationId,
            null,
            callback
        );
    }
    // Clean compleated and expiration jobs
    // public cleanJobs(correlationId: string, callback?: (err: any) => void): void {
    // this.callCommand(
    //     'clean_jobs',
    //     correlationId,
    //     null,
    //     callback
    // );
    // }

}