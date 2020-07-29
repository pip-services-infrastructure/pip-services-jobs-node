let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
let restify = require('restify');

import { ConfigParams, DateTimeConverter } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { JobV1 } from '../../../src/data/version1/JobV1';
import { JobsMemoryPersistence } from '../../../src/persistence/JobsMemoryPersistence';
import { JobsController } from '../../../src/logic/JobsController';
import { JobsHttpServiceV1 } from '../../../src/services/version1/JobsHttpServiceV1';
import { NewJobV1 } from '../../../src/data/version1/NewJobV1';

const JOB1: NewJobV1 = {
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    ttl: 1000 * 60 * 60 * 3, // 3 hour
};
const JOB2: NewJobV1 = {
    type: "t1",
    ref_id: "obj_0fsd",
    params: null,
    ttl: 1000 * 60 * 60, // 1 hour
};
const JOB3: NewJobV1 = {
    type: "t2",
    ref_id: "obj_3fsd",
    params: null,
    ttl: 1000 * 60 * 30, // 30 minutes
};

suite('JobsHttpServiceV1', () => {
    let persistence: JobsMemoryPersistence;
    let controller: JobsController;
    let service: JobsHttpServiceV1;
    let rest: any;

    setup((done) => {
        let url = "http://localhost:3000";
        rest = restify.createJsonClient({ url: url, version: '*' });

        persistence = new JobsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new JobsController();
        controller.configure(new ConfigParams());

        service = new JobsHttpServiceV1();
        service.configure(ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        ));

        let references = References.fromTuples(
            new Descriptor('pip-services-jobs', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-jobs', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-jobs', 'service', 'http', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            service.open(null, done);
        });
    });

    teardown((done) => {
        service.close(null, (err) => {
            persistence.close(null, done);
        });
    });

    test('CRUD Operations', (done) => {
        let job1: JobV1;

        async.series([
            // Create the first job

            (callback) => {
                rest.post('/v1/jobs/add_job',
                    {
                        new_job: JOB1
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/add_uniq_job',
                    {
                        new_job: JOB2
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/add_job',
                    {
                        new_job: JOB3
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/get_job_by_id',
                    {
                        job_id: job1.id
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/get_jobs',
                    {
                        filter: new FilterParams(),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
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
                rest.post('/v1/jobs/delete_job_by_id',
                    {
                        job_id: job1.id
                    },
                    (err, req, res, job) => {
                        assert.isNull(err);

                        assert.isObject(job);
                        assert.equal(job1.id, job.id);

                        callback();
                    }
                )
            },
            // Try to get deleted job
            (callback) => {
                rest.post('/v1/jobs/get_job_by_id',
                    {
                        job_id: job1.id
                    },
                    (err, req, res, job) => {
                        assert.isNull(err);

                        assert.isEmpty(job);

                        callback();
                    }
                )
            },
            // Delete all jobs
            (callback) => {
                rest.post('/v1/jobs/delete_jobs',
                    null,
                    (err, req, res, ) => {
                        assert.isNull(err);
                        callback();
                    }
                )
            },

            // Try to get jobs after delete
            (callback) => {
                rest.post('/v1/jobs/get_jobs',
                    {
                        filter: new FilterParams(),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
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
                rest.post('/v1/jobs/add_job',
                    {
                        new_job: JOB1
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/add_uniq_job',
                    {
                        new_job: JOB2
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/add_job',
                    {
                        new_job: JOB3
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/get_job_by_id',
                    {
                        job_id: job1.id
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/get_jobs',
                    {
                        filter: new FilterParams(),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        job1 = page.data[0];
                        job2 = page.data[1];
                        callback();
                    }
                )
            },
            // Test start job by type
            (callback) => {
                rest.post('/v1/jobs/start_job_by_type',
                    {
                        type: job1.type,
                        timeout: 1000 * 60 * 10
                    },
                    (err, req, res, job) => {
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
                rest.post('/v1/jobs/extend_job',
                    {
                        job_id: job1.id,
                        timeout: 1000 * 60 * 10
                    },
                    (err, req, res, job) => {
                        assert.isNull(err);
                        assert.isObject(job);

                        assert.isNotNull(job.locked_until);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test compleate job
            (callback) => {
                rest.post('/v1/jobs/complete_job',
                    {
                        job_id: job1.id
                    },
                    (err, req, res, job) => {
                        assert.isNull(err);
                        assert.isObject(job);

                        assert.isNotNull(job.completed);
                        job1 = job;
                        callback(err);
                    }
                );
            },
            // Test start
            (callback) => {

                rest.post('/v1/jobs/start_job_by_id',
                    {
                        job_id: job2.id,
                        timeout: 1000 * 60  // set timeout 1 min
                    },
                    (err, req, res, job) => {
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
                //controller.abortJob(
                rest.post('/v1/jobs/abort_job',
                    {
                        job_id: job2.id
                    },
                    (err, req, res, job) => {
                        assert.isNull(err);
                        assert.isObject(job);

                        assert.isNull(job.locked_until);
                        assert.isNull(job.started);

                        callback(err);
                    }
                );
            }
        ], done);
    });

});