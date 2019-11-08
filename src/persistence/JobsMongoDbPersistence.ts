let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { JobV1 } from '../data/version1/JobV1';
import { IJobsPersistence } from './IJobsPersistence';
import { JobsMongoDbSchema } from './JobsMongoDbSchema';

export class JobsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<JobV1, string>
    implements IJobsPersistence {
    constructor() {
        //super('jobs', JobsMongoDbSchema());
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

        let lock = filter.getAsNullableBoolean('lock');
        if (lock != null)
            criteria.push({ lock: lock });

        let try_counter = filter.getAsNullableInteger('try_counter');
        if (try_counter != null)
            criteria.push({ try_counter: try_counter });
        let try_counter_min = filter.getAsNullableInteger('try_counter_min');
        if (try_counter_min != null)
            criteria.push({ try_counter: { $gt: try_counter_min } });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<JobV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public deleteByFilter(correlationId: string, filter:FilterParams, callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}