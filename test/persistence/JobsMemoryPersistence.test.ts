import { ConfigParams } from 'pip-services3-commons-node';

import { JobsMemoryPersistence } from '../../src/persistence/JobsMemoryPersistence';
import { JobsPersistenceFixture } from './JobsPersistenceFixture';

suite('JobsMemoryPersistence', () => {
    let persistence: JobsMemoryPersistence;
    let fixture: JobsPersistenceFixture;

    setup((done) => {
        persistence = new JobsMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new JobsPersistenceFixture(persistence);

        persistence.open(null, done);
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