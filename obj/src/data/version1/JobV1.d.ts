import { NewJobV1 } from "./NewJobV1";
export declare class JobV1 {
    id: string;
    type: string;
    ref_id: string;
    params: any;
    timeout: Date;
    created: Date;
    started?: Date;
    locked_until?: Date;
    execute_until: Date;
    completed?: Date;
    lock: boolean;
    try_counter: number;
    constructor(newJob?: NewJobV1);
}
