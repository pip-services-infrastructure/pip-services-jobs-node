"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class JobV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('ref_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('params', null);
        this.withRequiredProperty('timeout', pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty('created', null);
        this.withOptionalProperty('started', null);
        this.withOptionalProperty('locked_until', null);
        this.withRequiredProperty('execute_until', null);
        this.withOptionalProperty('completed', null);
        this.withRequiredProperty('lock', pip_services3_commons_node_2.TypeCode.Boolean);
        this.withRequiredProperty('try_counter', pip_services3_commons_node_2.TypeCode.Integer);
    }
}
exports.JobV1Schema = JobV1Schema;
//# sourceMappingURL=JobV1Schema.js.map