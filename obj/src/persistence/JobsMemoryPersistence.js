"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class JobsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
        let lock = filter.getAsNullableBoolean('lock');
        let try_counter = filter.getAsNullableInteger('try_counter');
        let try_counter_min = filter.getAsNullableInteger('try_counter_min');
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
            if (started != null && item.started.valueOf() != started.valueOf())
                return false;
            if (started_min != null && item.started.valueOf() <= started_min.valueOf())
                return false;
            if (started_max != null && item.started.valueOf() >= started_max.valueOf())
                return false;
            if (locked_until != null && item.locked_until.valueOf() != locked_until.valueOf())
                return false;
            if (locked_until_min != null && item.locked_until.valueOf() <= locked_until_min.valueOf())
                return false;
            if (locked_until_max != null && item.locked_until.valueOf() >= locked_until_max.valueOf())
                return false;
            if (execute_until != null && item.execute_until.valueOf() != execute_until.valueOf())
                return false;
            if (execute_until_min != null && item.execute_until.valueOf() <= execute_until_min.valueOf())
                return false;
            if (execute_until_max != null && item.execute_until.valueOf() >= execute_until_max.valueOf())
                return false;
            if (completed != null && item.completed.valueOf() != completed.valueOf())
                return false;
            if (completed_min != null && item.completed.valueOf() <= completed_min.valueOf())
                return false;
            if (completed_max != null && item.completed.valueOf() >= completed_max.valueOf())
                return false;
            if (lock != null && item.lock != lock)
                return false;
            if (try_counter != null && item.try_counter != try_counter)
                return false;
            if (try_counter_min != null && item.try_counter <= try_counter_min)
                return false;
            return true;
        };
    }
    composeFilterStartJob(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let type = filter.getAsNullableString('type');
        let lock = filter.getAsNullableBoolean('lock');
        let max_retries = filter.getAsNullableInteger('max_retries');
        let curent_dt = filter.getAsNullableDateTime('curent_dt');
        return (item) => {
            if (type != null && item.type != type)
                return false;
            if (lock != null && item.lock != lock)
                return false;
            if (max_retries != null && item.try_counter > max_retries)
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
    updateJobForStart(correlationId, filter, item, callback) {
        super.getPageByFilter(correlationId, this.composeFilterStartJob(filter), new pip_services3_commons_node_2.PagingParams, null, null, (err, page) => {
            if (err != null) {
                callback(err, null);
                return;
            }
            if (page.data.length > 0) {
                let job = page.data[0];
                job.started = item.started;
                job.locked_until = new Date(job.started.getUTCMilliseconds() + job.timeout);
                job.lock = item.lock;
                job.try_counter = job.try_counter + 1;
                this.update(correlationId, job, callback);
            }
            else {
                callback(err, null);
            }
        });
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.JobsMemoryPersistence = JobsMemoryPersistence;
//# sourceMappingURL=JobsMemoryPersistence.js.map