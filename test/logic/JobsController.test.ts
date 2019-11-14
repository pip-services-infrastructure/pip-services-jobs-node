let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { JobV1 } from '../../src/data/version1/JobV1';
import { JobsMemoryPersistence } from '../../src/persistence/JobsMemoryPersistence';
import { JobsController } from '../../src/logic/JobsController';
import { NewJobV1 } from '../../src/data/version1/NewJobV1';

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

suite('JobsController', () => {
    let persistence: JobsMemoryPersistence;
    let controller: JobsController;

    setup((done) => {
        persistence = new JobsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new JobsController();
        controller.configure(new ConfigParams());

        let references = References.fromTuples(
            new Descriptor('jobs', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('jobs', 'controller', 'default', 'default', '1.0'), controller
        );

        controller.setReferences(references);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        let job1: JobV1;

        async.series([
            // Create the first job
            (callback) => {
                controller.addJob(
                    null,
                    JOB1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        job1 = job;
                        callback();
                    }
                );
            },
            // Create the second job
            (callback) => {
                controller.addUniqJob(
                    null,
                    JOB2,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);

                        callback();
                    }
                );
            },
            // Create the third job
            (callback) => {
                controller.addJob(
                    null,
                    JOB3,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB3.type, job.type);
                        assert.equal(JOB3.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB3.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);

                        callback();
                    }
                );
            },
            // Get one job
            (callback) => {
                controller.getJobById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(job1.id, job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(job1.retries, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        callback();
                    }
                )
            },
            // Get all jobs
            (callback) => {
                controller.getJobs(
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
                controller.deleteJob(
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
                controller.getJobById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isNull(job);

                        callback();
                    }
                )
            },
            // Delete all jobs
            (callback) => {
                controller.deleteJobs(
                    null,
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                )
            },

            // Try to get jobs after delete
            (callback) => {
                controller.getJobs(
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
    });


    test('Control operations', (done) => {
        let job1: JobV1;
        let job2: JobV1;
        async.series([
            // Create the first job
            (callback) => {
                controller.addJob(
                    null,
                    JOB1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        job1 = job;
                        callback();
                    }
                );
            },
            // Create the second job
            (callback) => {
                controller.addUniqJob(
                    null,
                    JOB2,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);

                        callback();
                    }
                );
            },
            // Create the third job
            (callback) => {
                controller.addJob(
                    null,
                    JOB3,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB3.type, job.type);
                        assert.equal(JOB3.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB3.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        
                        callback();
                    }
                );
            },
            // Get one job
            (callback) => {
                controller.getJobById(
                    null,
                    job1.id,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.equal(job1.id, job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        assert.equal(job1.retries, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        
                        callback();
                    }
                )
            },
            // Get all jobs
            (callback) => {
                controller.getJobs(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        job1 = page.data[0];
                        job2 = page.data[1];
                        callback();
                    }
                )
            },
            // Test start job by id
            (callback) => {
                controller.startJobByType(
                    null,
                    job1.type,
                    1000 * 60 * 10,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.isNotNull(job.locked_until);
                        assert.isNotNull(job.started);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test extend job
            (callback) => {
                let timeout = 1000*60*5;
                let newExeUntil = new Date(job1.execute_until.valueOf() + timeout);
                controller.extendJob(
                    null,
                    job1, timeout,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        
                        assert.equal(newExeUntil.getUTCMilliseconds(), job.execute_until.getUTCMilliseconds());
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test compleate job
            (callback) => {
                controller.compleateJob(
                    null,
                    job1,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.isNotNull(job.completed);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test start job
            (callback) => {
                let timeout = 1000 * 60; // set timeout 1 min
                controller.startJob(
                    null,
                    job2, timeout,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.isNotNull(job.locked_until);
                        assert.isNotNull(job.started);
                        job2 = job;
                        callback(err);
                    }
                );
            },
            // Test abort job
            (callback) => {
                controller.abortJob(
                    null,
                    job2,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.isNotNull(job.locked_until);
                        assert.isNull(job.started);
                        callback(err);
                    }
                );
            }
        ], done);
    });

    test('Test clean expired jobs', (done) => {

        let job1: JobV1;
        let job2: JobV1;
        let job3: JobV1;

        async.series([
            // Create the first job
            (callback) => {
                controller.addJob(
                    null,
                    JOB1,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB1.type, job.type);
                        assert.equal(JOB1.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB1.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        job1 = job;
                        callback();
                    }
                );
            },
            // Create the second job
            (callback) => {
                controller.addJob(
                    null,
                    JOB2,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB2.type, job.type);
                        assert.equal(JOB2.ref_id, job.ref_id);
                        
                        assert.equal(0, job.retries);
                        assert.equal(JOB2.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        job2 = job;
                        callback();
                    }
                );
            },
            // Create the third job
            (callback) => {
                controller.addJob(
                    null,
                    JOB3,
                    (err, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.isNotNull(job.id);
                        assert.equal(JOB3.type, job.type);
                        assert.equal(JOB3.ref_id, job.ref_id);
                        assert.equal(0, job.retries);
                        assert.equal(JOB3.params, job.params);
                        assert.isNotNull(job.created);
                        assert.isNotNull(job.execute_until);
                        assert.isNull(job.started);
                        assert.isNull(job.completed);
                        assert.isNull(job.locked_until);
                        job3 = job;

                        callback();
                    }
                );
            },
            // Get all jobs
            (callback) => {
                controller.getJobs(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);
                        callback();
                    }
                )
            },
            // Test start job by id
            (callback) => {
                controller.startJobByType(
                    null,
                    job1.type,
                    1000 * 60 * 10,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.isNotNull(job.locked_until);
                        assert.isNotNull(job.started);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test compleate job
            (callback) => {
                controller.compleateJob(
                    null,
                    job1,
                    (err, job) => {
                        assert.isNull(err);
                        assert.isObject(job);
                        assert.isNotNull(job.completed);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test clean jobs
            (callback) => {
                controller.cleanJobs(null, (err) => {
                    callback(err);
                });
            },
            // Get all jobs after clean
            (callback) => {
                controller.getJobs(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);
                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);
                        callback();
                    }
                )
            },
        ], done);
    });
});