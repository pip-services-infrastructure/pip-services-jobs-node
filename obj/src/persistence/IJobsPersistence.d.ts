import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { JobV1 } from '../data/version1/JobV1';
export interface IJobsPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<JobV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: JobV1) => void): void;
    create(correlationId: string, item: JobV1, callback: (err: any, item: JobV1) => void): void;
    update(correlationId: string, item: JobV1, callback: (err: any, item: JobV1) => void): void;
    updateJobForStart(correlationId: string, filter: FilterParams, item: JobV1, callback: (err: any, job: JobV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: JobV1) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
