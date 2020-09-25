"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsProcess = void 0;
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const JobsServiceFactory_1 = require("../build/JobsServiceFactory");
class JobsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super('jobs', 'Jobs orchestration microservice');
        this._factories.add(new JobsServiceFactory_1.JobsServiceFactory());
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory());
    }
}
exports.JobsProcess = JobsProcess;
//# sourceMappingURL=JobsProcess.js.map