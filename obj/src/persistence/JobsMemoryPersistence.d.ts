import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { JobV1 } from '../data/version1/JobV1';
import { IJobsPersistence } from './IJobsPersistence';
export declare class JobsMemoryPersistence extends IdentifiableMemoryPersistence<JobV1, string> implements IJobsPersistence {
    constructor();
    private composeFilter;
    startJobById(correlationId: string, id: string, timeout: number, callback: (err: any, job: JobV1) => void): void;
    startJobByType(correlationId: string, type: string, timeout: number, maxRetries: number, callback: (err: any, job: JobV1) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<JobV1>) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
