import { NewJobV1 } from "./NewJobV1";
export declare class JobV1 {
    id: string;
    type: string;
    ref_id: string;
    params: any;
    timeout: number;
    created: Date;
    started: Date;
    locked_until?: Date;
    execute_until?: Date;
    completed: Date;
    lock: boolean;
    retries: number;
    constructor(newJob?: NewJobV1);
}
