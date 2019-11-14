"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class NewJobV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('ref_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('params', null);
        this.withRequiredProperty('ttl', pip_services3_commons_node_2.TypeCode.Integer);
    }
}
exports.NewJobV1Schema = NewJobV1Schema;
//# sourceMappingURL=NewJobV1Schema.js.map