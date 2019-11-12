import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class NewJobV1Schema extends ObjectSchema {
    constructor() {
        super();
        //this.withRequiredProperty('id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('ref_id', TypeCode.String);
        this.withOptionalProperty('params', null);
        //this.withRequiredProperty('timeout', TypeCode.Integer);
        //this.withRequiredProperty('retries', TypeCode.Integer);
        this.withRequiredProperty('ttl', TypeCode.Integer);
    }
}