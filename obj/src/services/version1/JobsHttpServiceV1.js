"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsHttpServiceV1 = void 0;
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class JobsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/jobs');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-jobs', 'controller', '*', '*', '1.0'));
    }
}
exports.JobsHttpServiceV1 = JobsHttpServiceV1;
//# sourceMappingURL=JobsHttpServiceV1.js.map