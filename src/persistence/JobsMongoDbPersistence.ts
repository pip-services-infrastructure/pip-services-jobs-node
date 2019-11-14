let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { JobV1 } from '../data/version1/JobV1';
import { IJobsPersistence } from './IJobsPersistence';

export class JobsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<JobV1, string>
    implements IJobsPersistence {
    constructor() {
        super('jobs');
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });

        let ref_id = filter.getAsNullableString('ref_id');
        if (ref_id != null)
            criteria.push({ ref_id: ref_id });

        let created = filter.getAsNullableDateTime('created');
        if (created != null)
            criteria.push({ created: created });
        let created_min = filter.getAsNullableDateTime('created_min');
        if (created_min != null)
            criteria.push({ created: { $gt: created_min } });
        let created_max = filter.getAsNullableDateTime('created_max');
        if (created_max != null)
            criteria.push({ created: { $lt: created_max } });

        let started = filter.getAsNullableDateTime('started');
        if (started != null)
            criteria.push({ started: started });
        let started_min = filter.getAsNullableDateTime('started_min');
        if (started_min != null)
            criteria.push({ started: { $gt: started_min } });
        let started_max = filter.getAsNullableDateTime('started_max');
        if (started_max != null)
            criteria.push({ started: { $lt: started_max } });

        let locked_until = filter.getAsNullableDateTime('locked_until');
        if (locked_until != null)
            criteria.push({ locked_until: locked_until });
        let locked_until_min = filter.getAsNullableDateTime('locked_until_min');
        if (locked_until_min != null)
            criteria.push({ locked_until: { $gt: locked_until_min } });
        let locked_until_max = filter.getAsNullableDateTime('locked_until_max');
        if (locked_until_max != null)
            criteria.push({ locked_until: { $lt: locked_until_max } });

        let execute_until = filter.getAsNullableDateTime('execute_until');
        if (execute_until != null)
            criteria.push({ execute_until: execute_until });
        let execute_until_min = filter.getAsNullableDateTime('execute_until_min');
        if (execute_until_min != null)
            criteria.push({ execute_until: { $gt: execute_until_min } });
        let execute_until_max = filter.getAsNullableDateTime('execute_until_max');
        if (execute_until_max != null)
            criteria.push({ execute_until: { $lt: execute_until_max } });

        let completed = filter.getAsNullableDateTime('completed');
        if (completed != null)
            criteria.push({ completed: completed });
        let completed_min = filter.getAsNullableDateTime('completed_min');
        if (completed_min != null)
            criteria.push({ completed: { $gt: completed_min } });
        let completed_max = filter.getAsNullableDateTime('completed_max');
        if (completed != null)
            criteria.push({ completed: { $lt: completed_max } });

        let retries = filter.getAsNullableInteger('retries');
        if (retries != null)
            criteria.push({ retries: retries });
        let retries_min = filter.getAsNullableInteger('retries_min');
        if (retries_min != null)
            criteria.push({ retries: { $gt: retries_min } });

        let filterCriteria = filter.getAsNullableString('criteria');
        if (filterCriteria != null && filterCriteria == 'or') {
            return criteria.length > 0 ? { $or: criteria } : null;
        } else {
            return criteria.length > 0 ? { $and: criteria } : null;
        }

    }

    private composeFilterStartJob(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let andCriteria = [];

        let type = filter.getAsNullableString('type');
        if (type != null)
            andCriteria.push({ type: type });

        let max_retries = filter.getAsNullableInteger('max_retries');
        if (max_retries != null)
            andCriteria.push({ retries: { $lt: max_retries } });

        let curent_dt = filter.getAsNullableDateTime('curent_dt');
        if (curent_dt != null) {
            andCriteria.push({ $or: [{ locked_until: null }, { locked_until: { $lt: curent_dt } }] });
            andCriteria.push({ $or: [{ execute_until: null }, { execute_until: { $gte: curent_dt } }] });
        }

        return andCriteria.length > 0 ? { $and: andCriteria } : null;
    }
    // select item by filter and update
    public updateJobForStart(correlationId: string, filter: FilterParams, item: JobV1,
        callback: (err: any, job: JobV1) => void): void {
        if (item == null) {
            if (callback) callback(null, null);
            return;
        }

        let newItem = _.omit(item, 'id');
        newItem = this.convertFromPublic(newItem);

        let update = {
            $set: {
                timeout: newItem.timeout,
                started: newItem.started,
                locked_until: newItem.locked_until,
            },
            $inc: { retries: 1 }
        };

        let options = {
            returnOriginal: false
        };
        this._collection.findOneAndUpdate(this.composeFilterStartJob(filter), update, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Updated in %s with id = %s", this._collection, item.id);

            if (callback) {
                newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<JobV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}