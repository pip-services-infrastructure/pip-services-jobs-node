import { CommandableHttpService } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

export class JobsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/jobs');
        this._dependencyResolver.put('controller', new Descriptor('jobs', 'controller', '*', '*', '1.0'));
    }
}