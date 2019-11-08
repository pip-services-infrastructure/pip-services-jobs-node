import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class JobV1Schema extends ObjectSchema {
    constructor() {
        super();

        this.withRequiredProperty('id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('ref_id', TypeCode.String);
        this.withRequiredProperty('params', TypeCode.Object);
        this.withRequiredProperty('timeout', TypeCode.String);

        this.withRequiredProperty('created', TypeCode.String);
        this.withOptionalProperty('started', TypeCode.String);
        this.withOptionalProperty('locked_until', TypeCode.String);
        this.withRequiredProperty('execute_until', TypeCode.String);
        this.withOptionalProperty('completed', TypeCode.String);

        this.withRequiredProperty('lock', TypeCode.Boolean);

        this.withRequiredProperty('try_counter', TypeCode.Integer);

    }
}