let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { JobV1 } from '../../src/data/version1/JobV1';
import { IJobsPersistence } from '../../src/persistence/IJobsPersistence';
import { cursorTo } from 'readline';

let curentDate = new Date();

const JOB1: JobV1 = {
    id: "Job_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    timeout: 1000 * 60 * 30,
    created: new Date("2019-11-07T17:30:00"),
    started: new Date("2019-11-07T17:30:20"),
    locked_until: new Date("2019-11-07T18:00:20"),
    execute_until: new Date(curentDate.valueOf() + 1000*60*5),
    completed: null,
    lock: false,
    try_counter: 5
};
const JOB2: JobV1 = {
    id: "Job_t1_1fsd",
    type: "t1",
    ref_id: "obj_1fsd",
    params: null,
    timeout: 1000 * 60 * 15,
    created: new Date("2019-11-07T17:35:00"),
    started: new Date("2019-11-07T17:35:20"),
    locked_until: new Date("2019-11-07T17:50:20"),
    execute_until: new Date(curentDate.valueOf() + 1000*60*10),
    completed: null,
    lock: true,
    try_counter: 3
};
const JOB3: JobV1 = {
    id: "Job_t2_3fsd",
    type: "t2",
    ref_id: "obj_3fsd",
    params: null,
    timeout: 1000 * 60 * 10,
    created: new Date("2019-11-07T17:40:00"),
    started: new Date("2019-11-07T17:40:20"),
    locked_until: new Date("2019-11-07T17:50:20"),
    execute_until: new Date(curentDate.valueOf() + 1000*60*15),
    completed: null,
    lock: false,
    try_counter: 2
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
                        assert.equal(JOB1.timeout.valueOf(), job.timeout.valueOf());
                        assert.equal(JOB1.created.valueOf(), job.created.valueOf());
                        assert.equal(JOB1.started.valueOf(), job.started.valueOf());
                        assert.equal(JOB1.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(JOB1.lock, job.lock);
                        assert.equal(JOB1.try_counter, job.try_counter);

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
                        assert.equal(JOB2.timeout.valueOf(), job.timeout.valueOf());
                        assert.equal(JOB2.created.valueOf(), job.created.valueOf());
                        assert.equal(JOB2.started.valueOf(), job.started.valueOf());
                        assert.equal(JOB2.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(JOB2.lock, job.lock);
                        assert.equal(JOB2.try_counter, job.try_counter);

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
                        assert.equal(JOB3.timeout.valueOf(), job.timeout.valueOf());
                        assert.equal(JOB3.created.valueOf(), job.created.valueOf());
                        assert.equal(JOB3.started.valueOf(), job.started.valueOf());
                        assert.equal(JOB3.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(JOB3.lock, job.lock);
                        assert.equal(JOB3.try_counter, job.try_counter);

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
                )
            },
            // Update the job
            (callback) => {
                job1.try_counter = 4;

                this._persistence.update(
                    null,
                    job1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(job1.id, job.id);
                        assert.equal(4, job.try_counter);

                        callback();
                    }
                )
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
                        assert.equal(job1.timeout.valueOf(), job.timeout.valueOf());
                        assert.equal(job1.created.valueOf(), job.created.valueOf());
                        assert.equal(job1.started.valueOf(), job.started.valueOf());
                        assert.equal(job1.locked_until.valueOf(), job.locked_until.valueOf());
                        assert.equal(job1.lock, job.lock);
                        assert.equal(job1.try_counter, job.try_counter);

                        callback();
                    }
                )
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
                )
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
                )
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
                )
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
                )
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
                )
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
                )
            },
            // Filter by lock
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'lock', 'false'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            // Filter by try_counter
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'try_counter', '2'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },

            // Filter by try_counter_max
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'try_counter_min', '0'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                )
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
                )
            },
            // Filter by locked_until_max
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'locked_until_max', new Date("2019-11-07T18:10:00")
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                )
            },// Filter by execute_until_min
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'execute_until_min', new Date(curentDate.valueOf() + 1000*60*8)
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            // Test updateJobForStart
            (callback) => {
                let tmpJob = new JobV1();
                let curentDt = new Date();
                tmpJob.lock = true;
                tmpJob.started = curentDt;
                tmpJob.timeout = JOB3.timeout;
                tmpJob.locked_until = new Date(curentDt.valueOf() + JOB3.timeout);

                this._persistence.updateJobForStart(null, FilterParams.fromTuples(
                    'type', 't2',
                    'lock', false,
                    'max_retries', '6',
                    'curent_dt', curentDt
                ), tmpJob, (err, job) => {
                    assert.isNull(err);
                    assert.isObject(job);
                    assert.equal(true, job.lock);
                    assert.equal(JOB3.try_counter + 1, job.try_counter);
                    assert.equal(curentDt.getUTCMilliseconds(), job.started.getUTCMilliseconds());
                    let newLockUntil = new Date (curentDt.valueOf() + job.timeout);
                    assert.equal(newLockUntil.getUTCMilliseconds(), job.locked_until.getUTCMilliseconds());
                    callback();
                })
            }
        ], done);
    }
}
