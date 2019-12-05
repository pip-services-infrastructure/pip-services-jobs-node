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
        let created_from = filter.getAsNullableDateTime('created_from');
        if (created_from != null)
            criteria.push({ created: { $gte: created_from } });
        let created_to = filter.getAsNullableDateTime('created_to');
        if (created_to != null)
            criteria.push({ created: { $lte: created_to } });

        let started = filter.getAsNullableDateTime('started');
        if (started != null)
            criteria.push({ started: started });
        let started_from = filter.getAsNullableDateTime('started_from');
        if (started_from != null)
            criteria.push({ started: { $gte: started_from } });
        let started_to = filter.getAsNullableDateTime('started_to');
        if (started_to != null)
            criteria.push({ started: { $lte: started_to } });

        let locked_until = filter.getAsNullableDateTime('locked_until');
        if (locked_until != null)
            criteria.push({ locked_until: locked_until });
        let locked_from = filter.getAsNullableDateTime('locked_from');
        if (locked_from != null)
            criteria.push({ locked_until: { $gte: locked_from } });
        let locked_to = filter.getAsNullableDateTime('locked_to');
        if (locked_to != null)
            criteria.push({ locked_until: { $lte: locked_to } });

        let execute_until = filter.getAsNullableDateTime('execute_until');
        if (execute_until != null)
            criteria.push({ execute_until: execute_until });
        let execute_from = filter.getAsNullableDateTime('execute_from');
        if (execute_from != null)
            criteria.push({ execute_until: { $gte: execute_from } });
        let execute_to = filter.getAsNullableDateTime('execute_to');
        if (execute_to != null)
            criteria.push({ execute_until: { $lte: execute_to } });

        let completed = filter.getAsNullableDateTime('completed');
        if (completed != null)
            criteria.push({ completed: completed });
        let completed_from = filter.getAsNullableDateTime('completed_from');
        if (completed_from != null)
            criteria.push({ completed: { $gte: completed_from } });
        let completed_to = filter.getAsNullableDateTime('completed_to');
        if (completed != null)
            criteria.push({ completed: { $lte: completed_to } });

        let retries = filter.getAsNullableInteger('retries');
        if (retries != null)
            criteria.push({ retries: retries });
        let min_retries = filter.getAsNullableInteger('min_retries');
        if (min_retries != null)
            criteria.push({ retries: { $gt: min_retries } });

        return criteria.length > 0 ? { $and: criteria } : null;
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

        let now = filter.getAsNullableDateTime('now');
        if (now != null) {
            andCriteria.push({ $or: [{ locked_until: null }, { locked_until: { $lt: now } }] });
            andCriteria.push({ $or: [{ execute_until: null }, { execute_until: { $gte: now } }] });
        }

        return andCriteria.length > 0 ? { $and: andCriteria } : null;
    }

    public startJobById(correlationId: string, id: string, timeout: number,
        callback: (err: any, job: JobV1) => void): void {

        let now = new Date();

        let criteria = {
            $and: [
                { _id: id },
                { $or: [ 
                    { completed: { $eq: null } }, 
                    { completed: { $exists: false } }
                ] },
                { $or: [ 
                    { locked_until: { $eq: null } }, 
                    { locked_until: { $exists: false } },
                    { locked_until: { $lte: now } }
                ] }
            ]
        };

        let update = {
            $set: {
                timeout: timeout,
                started: now,
                locked_until: new Date(now.getTime() + timeout),
            },
            $inc: { retries: 1 }
        };

        let options = {
            returnOriginal: false
        };

        this._collection.findOneAndUpdate(criteria, update, options, (err, result) => {
            let item = result ? this.convertToPublic(result.value) : null;

            if (err == null) {
                if (item)
                    this._logger.trace(correlationId, "Updated in %s with id = %s", this._collection, item.id);
                else
                    this._logger.trace(correlationId, "Item %s was not found", id);
            }

            if (callback) callback(err, item);
        });    
    }

    public startJobByType(correlationId: string, type: string, timeout: number, maxRetries: number,
        callback: (err: any, job: JobV1) => void): void {

        let now = new Date();

        let criteria = {
            $and: [
                { type: type },
                { $or: [ 
                    { completed: { $eq: null } }, 
                    { completed: { $exists: false } }
                ] },
                { $or: [ 
                    { locked_until: { $eq: null } }, 
                    { locked_until: { $exists: false } },
                    { locked_until: { $lte: now } }
                ] },
                { retries: { $lt: maxRetries } }
            ]
        };

        let update = {
            $set: {
                timeout: timeout,
                started: now,
                locked_until: new Date(now.getTime() + timeout),
            },
            $inc: { retries: 1 }
        };

        let options = {
            returnOriginal: false
        };

        this._collection.findOneAndUpdate(criteria, update, options, (err, result) => {
            let item = result ? this.convertToPublic(result.value) : null;

            if (err == null) {
                if (item)
                    this._logger.trace(correlationId, "Updated in %s with id = %s", this._collection, item.id);
                else
                    this._logger.trace(correlationId, "Item with type %s was not found", type);
            }

            if (callback) callback(err, item);
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