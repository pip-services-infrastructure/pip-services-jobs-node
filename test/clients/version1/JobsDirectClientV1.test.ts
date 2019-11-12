
// import { ConfigParams } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';

// import { JobsMemoryPersistence } from '../../../src/persistence/JobsMemoryPersistence';
// import { JobsController } from '../../../src/logic/JobsController';
// import { JobsDirectClientV1 } from '../../../src/clients/version1/JobsDirectClientV1';
// import { JobsClientV1Fixture } from './JobsClientV1Fixture';
// import { JobsFilePersistence } from '../../../src/persistence/JobsFilePersistence';


// suite('JobsDirectClientV1', () => {
//     let persistence: JobsMemoryPersistence;
//     let controller: JobsController;
//     let client: JobsDirectClientV1;
//     let fixture: JobsClientV1Fixture;

//     setup((done) => {
//         persistence = new JobsMemoryPersistence();
//         //persistence = new JobsFilePersistence('data/jobs.test.json');
//         persistence.configure(new ConfigParams());

//         controller = new JobsController();
//         controller.configure(new ConfigParams());

//         client = new JobsDirectClientV1();

//         let references = References.fromTuples(
//             new Descriptor('jobs', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('jobs', 'controller', 'default', 'default', '1.0'), controller,
//             new Descriptor('jobs', 'client', 'direct', 'default', '1.0'), client
//         );

//         controller.setReferences(references);
//         client.setReferences(references);

//         fixture = new JobsClientV1Fixture(client);

//         persistence.open(null, done);
//     });

//     teardown((done) => {
//         persistence.close(null, done);
//     });

//     test('CRUD Operations', (done) => {
//         fixture.testCrudOperations(done);
//     });

//     test('Controll test', (done) => {
//         fixture.testControll(done);
//     });
// });