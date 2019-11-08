import { NewJobV1 } from "../../data/version1/NewJobV1";
import { JobV1 } from "../../data/version1";
import { FilterParams, PagingParams, DataPage } from "pip-services3-commons-node";

export interface IJobsClientV1 {
    // Add new job
    addJob(correlationId: string, newJob: NewJobV1, callback: (err: any, job: JobV1) => void): void;
    // Add new job if not exist with same type and ref_id
    addUniqJob(correlationId: string, newJob: NewJobV1, callback: (err: any, job: JobV1) => void): void;
    // Get list of all jobs
    getJobs(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<JobV1>) => void): void;
    // Start job
    startJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void;
    // Extend job execution limit on timeout value
    extendJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void;
    // Abort job
    abortJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void;
    // Compleate job
    compleateJob(correlationId: string, job: JobV1, callback: (err: any, job: JobV1) => void): void;
    // Get job by Id
    getJobById(correlationId: string, jobId: string, callback: (err: any, page: JobV1) => void): void;
    // Delete job by Id
    deleteJob(correlationId: string, jobId: string, callback: (err: any, job: JobV1) => void): void;
    // Remove all jobs
    deleteJobs(correlationId: string, callback?: (err: any) => void): void;
      // Clean compleated and expiration jobs
    //cleanJobs(correlationId: string, callback?: (err: any) => void): void;
}