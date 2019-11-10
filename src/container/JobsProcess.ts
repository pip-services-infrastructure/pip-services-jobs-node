import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import {JobsServiceFactory} from '../build/JobsServiceFactory';

export class JobsProcess extends ProcessContainer{
    public constructor(){
        super('jobs', 'Jobs microservice');

        this._factories.add(new JobsServiceFactory());
        this._factories.add(new DefaultRpcFactory());
    }
}