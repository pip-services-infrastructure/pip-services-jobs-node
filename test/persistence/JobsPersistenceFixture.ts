let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { JobV1 } from '../../src/data/version1/JobV1';
import { IJobsPersistence } from '../../src/persistence/IJobsPersistence';

let now = new Date();

const JOB1: JobV1 = {
    id: "Job_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    created: new Date("2019-11-07T17:30:00"),
    started: new Date("2019-11-07T17:30:20"),
    locked_until: new Date("2019-11-07T18:00:20"),
    execute_until: new Date(now.getTime() + 1000 * 60 * 5),
    completed: null,  
    retries: 5
};
const JOB2: JobV1 = {
    id: "Job_t1_1fsd",
    type: "t1",
    ref_id: "obj_1fsd",
    params: null,
    created: new Date("2019-11-07T17:35:00"),
    started: new Date("2019-11-07T17:35:20"),
    locked_until: new Date("2019-11-07T17:50:20"),
    execute_until: new Date(now.getTime() + 1000 * 60 * 10),
    completed: null,  
    retries: 3
};
const JOB3: JobV1 = {
    id: "Job_t2_3fsd",
    type: "t2",
    ref_id: "obj_3fsd",
    params: null,
    created: new Date("2019-11-07T17:40:00"),
    started: new Date("2019-11-07T17:40:20"),
    locked_until: new Date("2019-11-07T17:50:20"),
    execute_until: new Date(now.getTime() + 1000 * 60 * 15),
    completed: null,
    retries: 2
};

export class JobsPersistenceFixture {
    private _persistence: IJobsPersistence;

    public constructor(persistence: IJobsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateJobs(done) {
        async.series([
            // Create the first job
            (callback) => {
                this._persistence.create(
                    null,
                    JOB1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(JOB1.id, job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(JOB1.created.valueOf(), job.created.valueOf());
                        assert.equal(JOB1.started.valueOf(), job.started.valueOf());
                        assert.equal(JOB1.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(JOB1.retries, job.retries);

                        callback();
                    }
                );
            },
            // Create the second job
            (callback) => {
                this._persistence.create(
                    null,
                    JOB2,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(JOB2.id, job.id);
                        assert.equal(JOB2.type, job.type);
                        assert.equal(JOB2.ref_id, job.ref_id);
                        assert.equal(JOB2.created.valueOf(), job.created.valueOf());
                        assert.equal(JOB2.started.valueOf(), job.started.valueOf());
                        assert.equal(JOB2.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(JOB2.retries, job.retries);

                        callback();
                    }
                );
            },
            // Create the third job
            (callback) => {
                this._persistence.create(
                    null,
                    JOB3,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(JOB3.id, job.id);
                        assert.equal(JOB3.type, job.type);
                        assert.equal(JOB3.ref_id, job.ref_id);
                        assert.equal(JOB3.created.valueOf(), job.created.valueOf());
                        assert.equal(JOB3.started.valueOf(), job.started.valueOf());
                        assert.equal(JOB3.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(JOB3.retries, job.retries);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testCrudOperations(done) {
        let job1: JobV1;

        async.series([
            // Create items
            (callback) => {
                this.testCreateJobs(callback);
            },
            // Get all jobs
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        job1 = page.data[0];
                        callback();
                    }
                );
            },
            // Update the job
            (callback) => {
                job1.retries = 4;

                this._persistence.update(
                    null,
                    job1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(job1.id, job.id);
                        assert.equal(4, job.retries);

                        callback();
                    }
                );
            },
            // Get job by id
            (callback) => {
                this._persistence.getOneById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(job1.id, job.id);

                        assert.equal(job1.type, job.type);
                        assert.equal(job1.ref_id, job.ref_id);
                        assert.equal(job1.created.valueOf(), job.created.valueOf());
                        assert.equal(job1.started.valueOf(), job.started.valueOf());
                        assert.equal(job1.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(job1.retries, job.retries);

                        callback();
                    }
                );
            },
            // Delete the job
            (callback) => {
                this._persistence.deleteById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(job1.id, job.id);

                        callback();
                    }
                );
            },
            // Try to get deleted job
            (callback) => {
                this._persistence.getOneById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isNull(job || null);

                        callback();
                    }
                );
            },
            // Delete all jobs
            (callback) => {
                this._persistence.deleteByFilter(
                    null,
                    new FilterParams(),
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
            // Try to get jobs after delete
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 0);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilters(done) {
        async.series([
            // Create items
            (callback) => {
                this.testCreateJobs(callback);
            },
            // Filter by id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'id', 'Job_t1_0fsd'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
            // Filter by type
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'type', 't1'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
            // Filter by retries
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'retries', '2'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
            // Filter by retries_max
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'min_retries', '0'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                );
            },
            // Filter by created
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'created', new Date("2019-11-07T17:40:00")
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
            // Filter by locked_to
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'locked_to', new Date("2019-11-07T18:10:00")
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                );
            },
            // Filter by execute_from
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'execute_from', new Date(now.getTime() + 1000 * 60 * 8)
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
            // Test updateJobForStart
            (callback) => {
                this._persistence.startJobByType(null, 't2', 1000, 6,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(JOB3.retries + 1, job.retries);
                        assert.isNotNull(job.started.valueOf());
                        assert.isNotNull(job.locked_until);
                        callback();
                    }
                );
            }
        ], done);
    }
}
