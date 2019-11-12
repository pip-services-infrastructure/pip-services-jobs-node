import { NewJobV1 } from "./NewJobV1";

export class JobV1 {

    // Job description
    id: string;
    type: string;
    ref_id: string;
    params: any;
    timeout: number;

    // Job control
    created: Date;
    started: Date;
    locked_until: Date;
    execute_until: Date;
    completed: Date;
    lock: boolean;
    try_counter: number;

    constructor(newJob?: NewJobV1);
    constructor(newJob: NewJobV1) {
        let curentDt = new Date();
        this.lock = false;
        this.created = curentDt;
        this.try_counter = 0;
        this.timeout = 0;
        if (newJob) {
            //this.id = newJob.id;
            this.type = newJob.type;
            this.ref_id = newJob.ref_id;
            //this.timeout = newJob.timeout;
            this.params = newJob.params;
            this.execute_until = new Date(curentDt.valueOf() + newJob.ttl);
        }
    }
}