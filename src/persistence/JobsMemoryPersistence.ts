let _ = require('lodash');

import { FilterParams, DateTimeConverter } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { JobV1 } from '../data/version1/JobV1';
import { IJobsPersistence } from './IJobsPersistence';

export class JobsMemoryPersistence
    extends IdentifiableMemoryPersistence<JobV1, string>
    implements IJobsPersistence {

    constructor() {
        super();

        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let type = filter.getAsNullableString('type');
        let ref_id = filter.getAsNullableString('ref_id');

        let created = filter.getAsNullableDateTime('created');
        let created_min = filter.getAsNullableDateTime('created_min');
        let created_max = filter.getAsNullableDateTime('created_max');

        let started = filter.getAsNullableDateTime('started');
        let started_min = filter.getAsNullableDateTime('started_min');
        let started_max = filter.getAsNullableDateTime('started_max');

        let locked_until = filter.getAsNullableDateTime('locked_until');
        let locked_until_min = filter.getAsNullableDateTime('locked_until_min');
        let locked_until_max = filter.getAsNullableDateTime('locked_until_max');

        let execute_until = filter.getAsNullableDateTime('execute_until');
        let execute_until_min = filter.getAsNullableDateTime('execute_until_min');
        let execute_until_max = filter.getAsNullableDateTime('execute_until_max');

        let completed = filter.getAsNullableDateTime('completed');
        let completed_min = filter.getAsNullableDateTime('completed_min');
        let completed_max = filter.getAsNullableDateTime('completed_max');

        let retries = filter.getAsNullableInteger('retries');
        let retries_min = filter.getAsNullableInteger('retries_min');

        let filterCriteria = filter.getAsNullableString('criteria');

        if (filterCriteria != null && filterCriteria == 'or') { // or criteria
            return (item) => {
                if (id != null && item.id == id)
                    return true;
                if (type != null && item.type == type)
                    return true;
                if (ref_id != null && item.ref_id == ref_id)
                    return true;
                if (created != null && item.created.valueOf() == created.valueOf())
                    return true;
                if (created_min != null && item.created.valueOf() >= created_min.valueOf())
                    return true;
                if (created_max != null && item.created.valueOf() <= created_max.valueOf())
                    return true;
                if (started != null && item.started && item.started.valueOf() == started.valueOf())
                    return true;
                if (started_min != null && item.started && item.started.valueOf() >= started_min.valueOf())
                    return true;
                if (started_max != null && item.started && item.started.valueOf() <= started_max.valueOf())
                    return true;
                if (locked_until != null && item.locked_until && item.locked_until.valueOf() == locked_until.valueOf())
                    return true;
                if (locked_until_min != null && item.locked_until && item.locked_until.valueOf() >= locked_until_min.valueOf())
                    return true;
                if (locked_until_max != null && item.locked_until && item.locked_until.valueOf() <= locked_until_max.valueOf())
                    return true;
                if (execute_until != null && item.execute_until.valueOf() == execute_until.valueOf())
                    return true;
                if (execute_until_min != null && item.execute_until.valueOf() >= execute_until_min.valueOf())
                    return true;
                if (execute_until_max != null && item.execute_until.valueOf() <= execute_until_max.valueOf())
                    return true;
                if (completed != null && item.completed && item.completed.valueOf() == completed.valueOf())
                    return true;
                if (completed_min != null && item.completed && item.completed.valueOf() >= completed_min.valueOf())
                    return true;
                if (completed_max != null && item.completed && item.completed.valueOf() <= completed_max.valueOf())
                    return true;
                if (retries != null && item.retries == retries)
                    return true;
                if (retries_min != null && item.retries >= retries_min)
                    return true;
                return false;
            };
        } else { // and criteria default
            return (item) => {
                if (id != null && item.id != id)
                    return false;
                if (type != null && item.type != type)
                    return false;
                if (ref_id != null && item.ref_id != ref_id)
                    return false;
                if (created != null && item.created.valueOf() != created.valueOf())
                    return false;
                if (created_min != null && item.created.valueOf() <= created_min.valueOf())
                    return false;
                if (created_max != null && item.created.valueOf() >= created_max.valueOf())
                    return false;
                if (started != null && item.started && item.started.valueOf() != started.valueOf())
                    return false;
                if (started_min != null && item.started && item.started.valueOf() <= started_min.valueOf())
                    return false;
                if (started_max != null && item.started && item.started.valueOf() >= started_max.valueOf())
                    return false;
                if (locked_until != null && item.locked_until.valueOf() != locked_until.valueOf())
                    return false;
                if (locked_until_min != null && item.locked_until && item.locked_until.valueOf() <= locked_until_min.valueOf())
                    return false;
                if (locked_until_max != null && item.locked_until && item.locked_until.valueOf() >= locked_until_max.valueOf())
                    return false;
                if (execute_until != null && item.execute_until.valueOf() != execute_until.valueOf())
                    return false;
                if (execute_until_min != null && item.execute_until.valueOf() <= execute_until_min.valueOf())
                    return false;
                if (execute_until_max != null && item.execute_until.valueOf() >= execute_until_max.valueOf())
                    return false;
                if (completed != null && item.completed && item.completed.valueOf() != completed.valueOf())
                    return false;
                if (completed_min != null && item.completed && item.completed.valueOf() <= completed_min.valueOf())
                    return false;
                if (completed_max != null && item.completed && item.completed.valueOf() >= completed_max.valueOf())
                    return false;
                if (retries != null && item.retries != retries)
                    return false;
                if (retries_min != null && item.retries <= retries_min)
                    return false;
                return true;
            };
        }
    }

    private composeFilterStartJob(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let type = filter.getAsNullableString('type');
        let max_retries = filter.getAsNullableInteger('max_retries');
        let curent_dt = filter.getAsNullableDateTime('curent_dt');

        return (item) => {
            if (type != null && item.type != type)
                return false;
            if (max_retries != null && item.retries > max_retries)
                return false;
            if (curent_dt != null) {
                if (item.locked_until != null && item.locked_until.valueOf() >= curent_dt.valueOf())
                    return false;
                if (item.execute_until != null && item.execute_until.valueOf() < curent_dt.valueOf())
                    return false;
            }
            return true;
        };
    }

    // select item by filter and update
    public updateJobForStart(correlationId: string, filter: FilterParams, item: JobV1,
        callback: (err: any, job: JobV1) => void): void {

        super.getPageByFilter(correlationId, this.composeFilterStartJob(filter), new PagingParams, null, null, (err, page) => {
            if (err != null) {
                callback(err, null);
                return;
            }
            if (page.data.length > 0) {
                let job = page.data[0];
                job.started = item.started;
                job.locked_until = item.locked_until;
                job.retries = job.retries + 1;
                this.update(correlationId, job, callback);
            } else {
                callback(err, null);
            }
        })
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<JobV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}