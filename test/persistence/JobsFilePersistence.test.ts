import { ConfigParams } from 'pip-services3-commons-node';

import { JobsFilePersistence } from '../../src/persistence/JobsFilePersistence';
import { JobsPersistenceFixture } from './JobsPersistenceFixture';

suite('JobsFilePersistence', () => {
    let persistence: JobsFilePersistence;
    let fixture: JobsPersistenceFixture;

    setup((done) => {
        persistence = new JobsFilePersistence('data/jobs.test.json');
        persistence.configure(new ConfigParams());

        fixture = new JobsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilters(done);
    });

});