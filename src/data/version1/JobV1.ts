import { NewJobV1 } from "./NewJobV1";

export class JobV1 {

    // Job description
    id: string;
    type: string;
    ref_id: string;
    params: any;
    timeout: Date;

    // Job control
    created: Date;
    started?: Date;
    locked_until?: Date;
    execute_until: Date;
    completed?: Date;
    lock: boolean;
    try_counter: number;  

    constructor(newJob?:NewJobV1);
    constructor(newJob:NewJobV1){
        this.id = newJob.id;
        this.type = newJob.type;
        this.ref_id = newJob.ref_id;
        this.try_counter = newJob.retries;
        this.timeout = newJob.timeout;
        this.params = newJob.params;
        this.lock = false;
        this.created = new Date();
        this.execute_until = new Date(this.created.getUTCMilliseconds() + newJob.ttl.getUTCMilliseconds());
    }
}