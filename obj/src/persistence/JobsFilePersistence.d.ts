import { JsonFilePersister } from 'pip-services3-data-node';
import { JobV1 } from '../data/version1/JobV1';
import { JobsMemoryPersistence } from './JobsMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-node';
export declare class JobsFilePersistence extends JobsMemoryPersistence {
    protected _persister: JsonFilePersister<JobV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
