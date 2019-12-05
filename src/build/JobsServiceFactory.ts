import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { JobsMemoryPersistence } from '../../src/persistence/JobsMemoryPersistence';
import { JobsFilePersistence } from '../../src/persistence/JobsFilePersistence';
import { JobsMongoDbPersistence } from '../../src/persistence/JobsMongoDbPersistence';
import { JobsController } from '../../src/logic/JobsController';
import { JobsHttpServiceV1 } from '../../src/services/version1/JobsHttpServiceV1';

export class JobsServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('pip-services-jobs', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('pip-services-jobs', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('pip-services-jobs', 'persistence', 'mongodb', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('pip-services-jobs', 'controller', 'default', '*', '1.0');
    public static HttpServiceV1Descriptor = new Descriptor('pip-services-jobs', 'service', 'http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(JobsServiceFactory.MemoryPersistenceDescriptor, JobsMemoryPersistence);
        this.registerAsType(JobsServiceFactory.FilePersistenceDescriptor, JobsFilePersistence);
        this.registerAsType(JobsServiceFactory.MongoDbPersistenceDescriptor, JobsMongoDbPersistence);
        this.registerAsType(JobsServiceFactory.ControllerDescriptor, JobsController);
        this.registerAsType(JobsServiceFactory.HttpServiceV1Descriptor, JobsHttpServiceV1);
    }
}