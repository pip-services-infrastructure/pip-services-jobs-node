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
        let created_from = filter.getAsNullableDateTime('created_from');
        let created_to = filter.getAsNullableDateTime('created_to');

        let started = filter.getAsNullableDateTime('started');
        let started_from = filter.getAsNullableDateTime('started_from');
        let started_to = filter.getAsNullableDateTime('started_to');

        let locked_until = filter.getAsNullableDateTime('locked_until');
        let locked_from = filter.getAsNullableDateTime('locked_from');
        let locked_to = filter.getAsNullableDateTime('locked_to');

        let execute_until = filter.getAsNullableDateTime('execute_until');
        let execute_from = filter.getAsNullableDateTime('execute_from');
        let execute_to = filter.getAsNullableDateTime('execute_to');

        let completed = filter.getAsNullableDateTime('completed');
        let completed_from = filter.getAsNullableDateTime('completed_from');
        let completed_to = filter.getAsNullableDateTime('completed_to');

        let retries = filter.getAsNullableInteger('retries');
        let min_retries = filter.getAsNullableInteger('min_retries');

        return (item) => {
            if (id != null && item.id != id)
                return false;
            if (type != null && item.type != type)
                return false;
            if (ref_id != null && item.ref_id != ref_id)
                return false;
            if (created != null && item.created.getTime() != created.getTime())
                return false;
            if (created_from != null && item.created.getTime() < created_from.getTime())
                return false;
            if (created_to != null && item.created.getTime() > created_to.getTime())
                return false;
            if (started != null && (item.started == null || item.started.getTime() != started.getTime()))
                return false;
            if (started_from != null && (item.started == null || item.started.getTime() < started_from.getTime()))
                return false;
            if (started_to != null && (item.started == null || item.started.getTime() > started_to.getTime()))
                return false;
            if (locked_until != null && (item.locked_until == null || item.locked_until.getTime() != locked_until.getTime()))
                return false;
            if (locked_from != null && (item.locked_until == null || item.locked_until.getTime() < locked_from.getTime()))
                return false;
            if (locked_to != null && (item.locked_until == null || item.locked_until.getTime() > locked_to.getTime()))
                return false;
            if (execute_until != null && (item.execute_until == null || item.execute_until.getTime() != execute_until.getTime()))
                return false;
            if (execute_from != null && (item.execute_until == null || item.execute_until.getTime() < execute_from.getTime()))
                return false;
            if (execute_to != null && (item.execute_until == null || item.execute_until.getTime() > execute_to.getTime()))
                return false;
            if (completed != null && (item.completed == null || item.completed.getTime() != completed.getTime()))
                return false;
            if (completed_from != null && (item.completed == null || item.completed.getTime() < completed_from.getTime()))
                return false;
            if (completed_to != null && (item.completed == null || item.completed.getTime() > completed_to.getTime()))
                return false;
            if (retries != null && item.retries != retries)
                return false;
            if (min_retries != null && item.retries <= min_retries)
                return false;
            return true;
        }
    }

    public startJobById(correlationId: string, id: string, timeout: number,
        callback: (err: any, job: JobV1) => void): void {
        let item = _.find(this._items, item => item.id == id);

        if (item == null) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            if (callback) callback(null, null);
            return;
        }

        let now = new Date();
        if (item.completed == null && (item.locked_until == null || item.locked_until.getTime() <= now.getTime())) {
            item.started = now;
            item.locked_until = new Date(now.getTime() + timeout);
            item.retries++;
            item.timeout = timeout;

            this._logger.trace(correlationId, "Updated item %s", item.id);

            this.save(correlationId, (err) => {
                if (callback) callback(err, item)
            });
        } else {
            this._logger.trace(correlationId, "Item %s was completed or locked", id);
            if (callback) callback(null, null);
        }    
    }

    public startJobByType(correlationId: string, type: string, timeout: number, maxRetries: number,
        callback: (err: any, job: JobV1) => void): void {

        let now = new Date();
        let item = _.find(this._items, (item) => {
            return item.type == type && item.completed == null && item.retries < maxRetries
                && (item.locked_until == null || item.locked_until.getTime() <= now);
        });

        if (item == null) {
            this._logger.trace(correlationId, "Item with type %s was not found", type);
            if (callback) callback(null, null);
            return;
        }

        item.started = now;
        item.locked_until = new Date(now.getTime() + timeout);
        item.retries++;
        item.timeout = timeout;

        this._logger.trace(correlationId, "Updated item %s", item.id);

        this.save(correlationId, (err) => {
            if (callback) callback(err, item)
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