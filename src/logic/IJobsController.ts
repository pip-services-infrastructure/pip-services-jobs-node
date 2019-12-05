import { FilterParams } from "pip-services3-commons-node";
import { PagingParams } from "pip-services3-commons-node";
import { DataPage } from "pip-services3-commons-node";

import { NewJobV1 } from "../data/version1/NewJobV1";
import { JobV1 } from "../data/version1";

export interface IJobsController {
    // Add new job
    addJob(correlationId: string, newJob: NewJobV1, callback: (err: any, job: JobV1) => void): void;
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId: string, newJob: NewJobV1, callback: (err: any, job: JobV1) => void): void;
    // Get list of all jobs
    getJobs(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<JobV1>) => void): void;
    // Get job by Id
    getJobById(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void;
    // Start job
    startJobById(correlationId: string, jobId: string, timeout: number, callback: (err: any, job: JobV1) => void): void;
    // Start fist free job by type
    startJobByType(correlationId: string, jobType: string, timeout: number, callback: (err: any, job: JobV1) => void): void;
    // Extend job execution limit on timeout value
    extendJob(correlationId: string, jobId: string, timeout: number, callback: (err: any, job: JobV1) => void): void;
    // Abort job
    abortJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void;
    // Compleate job
    completeJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void;
    // Delete job by Id
    deleteJobById(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void;
    // Remove all jobs
    deleteJobs(correlationId: string, callback?: (err: any) => void): void;
    // Clean completed and expiration jobs
    cleanJobs(correlationId: string, callback?: (err: any) => void): void;
}