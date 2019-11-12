import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { JobV1 } from '../data/version1/JobV1';
import { IJobsPersistence } from './IJobsPersistence';
export declare class JobsMongoDbPersistence extends IdentifiableMongoDbPersistence<JobV1, string> implements IJobsPersistence {
    constructor();
    private composeFilter;
    private composeFilterStartJob;
    updateJobForStart(correlationId: string, filter: FilterParams, item: JobV1, callback: (err: any, job: JobV1) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<JobV1>) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
