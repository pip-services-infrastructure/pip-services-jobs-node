let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { JobV1 } from '../../../src/data/version1/JobV1';
import { IJobsClientV1 } from '../../../src/clients/version1/IJobsClientV1';
import { NewJobV1 } from '../../../src/data/version1/NewJobV1';

const JOB1: NewJobV1 = {
    //id: "Job1_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    //timeout: 1000*60*30, // 30 min
    ttl: 1000 * 60 * 60 * 3, // 3 hour
    //retries: 5
};
const JOB2: NewJobV1 = {
    //id: "Job2_t1_0fsd",
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    //timeout: new Date(1000*60*15), // 15 min
    ttl: 1000 * 60 * 60, // 1 hour
    //retries: 3
};
const JOB3: NewJobV1 = {
    //id: "Job3_t2_3fsd",
    type: "t2",
    ref_id: "obj_3fsd",
    params: null,
    //timeout: new Date(1000*60*10), // 10 minutes
    ttl: 1000 * 60 * 30, // 30 minutes
    //retries: 2
};

export class JobsClientV1Fixture {
    private _client: IJobsClientV1;

    public constructor(client: IJobsClientV1) {
        assert.isNotNull(client);
        this._client = client;
    }

    public testCrudOperations(done) {
        let job1: JobV1;

        async.series([
            // Create the first job
            (callback) => {
                this._client.addJob(
                    null,
                    JOB1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(0, job.timeout);
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);
                        job1 = job;

                        callback();
                    }
                );
            },
            // Create the second job
            (callback) => {
                this._client.addUniqJob(
                    null,
                    JOB2,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(0, job.timeout);
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);

                        callback();
                    }
                );
            },
            // Create the third job
            (callback) => {
                this._client.addJob(
                    null,
                    JOB3,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB3.type, job.type);
                        assert.equal(JOB3.ref_id, job.ref_id);
                        assert.equal(0, job.timeout);
                        assert.equal(0, job.retries);
                        assert.equal(JOB3.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);

                        callback();
                    }
                );
            },
            // Get one job
            (callback) => {
                this._client.getJobById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(job1.id, job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(job1.timeout, job.timeout);
                        assert.equal(job1.retries, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);
                        callback();
                    }
                )
            },
            // Get all jobs
            (callback) => {
                this._client.getJobs(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        job1 = page.data[0];
                        callback();
                    }
                )
            },
            // Delete the job
            (callback) => {
                this._client.deleteJob(
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
                this._client.getJobById(
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
                this._client.deleteJobs(
                    null,
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                )
            },

            // Try to get jobs after delete
            (callback) => {
                this._client.getJobs(
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

    public testControll(done) {
        let job1: JobV1;
        let job2: JobV1;
        async.series([
            // Create the first job
            (callback) => {
                this._client.addJob(
                    null,
                    JOB1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(0, job.timeout);
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);
                        job1 = job;

                        callback();
                    }
                );
            },
            // Create the second job
            (callback) => {
                this._client.addUniqJob(
                    null,
                    JOB2,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(0, job.timeout);
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);

                        callback();
                    }
                );
            },
            // Create the third job
            (callback) => {
                this._client.addJob(
                    null,
                    JOB3,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB3.type, job.type);
                        assert.equal(JOB3.ref_id, job.ref_id);
                        assert.equal(0, job.timeout.valueOf());
                        assert.equal(0, job.retries);
                        assert.equal(JOB3.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);

                        callback();
                    }
                );
            },
            // Get one job
            (callback) => {
                this._client.getJobById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(job1.id, job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(job1.timeout, job.timeout);
                        assert.equal(job1.retries, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        assert.equal(false, job.lock);
                        callback();
                    }
                )
            },
            // Get all jobs
            (callback) => {
                this._client.getJobs(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        job1 = page.data[0];
                        job2 = page.data[0];
                        callback();
                    }
                )
            },
            // Test start job
            (callback) => {
                this._client.startJobByType(
                    null,
                    job1.type,
                    1000 * 60 * 10,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(true, job.lock);
                        assert.isNotNull(job.locked_until);
                        assert.isNotNull(job.started);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test extend job
            (callback) => {
                let newExeUntil = new Date(job1.execute_until.valueOf() + job1.timeout.valueOf());
                this._client.extendJob(
                    null,
                    job1,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(true, job.lock);

                        assert.equal(newExeUntil.getUTCMilliseconds(), job.execute_until.getUTCMilliseconds());
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test compleate job
            (callback) => {
                this._client.compleateJob(
                    null,
                    job1,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(false, job.lock);
                        assert.isNotNull(job.completed || null);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test start job
            (callback) => {
                job2.timeout = 1000 * 60; // set timeout 1 min
                this._client.startJob(
                    null,
                    job2,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(true, job.lock);
                        assert.isNotNull(job.locked_until);
                        assert.isNotNull(job.started);
                        job2 = job;
                        callback(err);
                    }
                );
            },
            // Test abort job
            (callback) => {
                this._client.abortJob(
                    null,
                    job2,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(false, job.lock);
                        assert.isNotNull(job.locked_until);
                        assert.isNull(job.started);
                        callback(err);
                    }
                );
            }
        ], done);

    }
}

