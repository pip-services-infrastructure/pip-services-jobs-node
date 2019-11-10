import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class JobsServiceFactory extends Factory {
    static MemoryPersistenceDescriptor: Descriptor;
    static FilePersistenceDescriptor: Descriptor;
    static MongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static HttpServiceV1Descriptor: Descriptor;
    constructor();
}
