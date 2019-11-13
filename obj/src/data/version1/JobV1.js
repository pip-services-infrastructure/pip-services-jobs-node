"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobV1 {
    constructor(newJob) {
        let curentDt = new Date();
        this.lock = false;
        this.created = curentDt;
        this.try_counter = 0;
        this.timeout = 0;
        this.completed = null;
        this.started = null;
        this.locked_until = null;
        this.execute_until = null;
        if (newJob) {
            this.type = newJob.type;
            this.ref_id = newJob.ref_id;
            this.params = newJob.params;
            this.execute_until = new Date(curentDt.valueOf() + newJob.ttl);
        }
    }
}
exports.JobV1 = JobV1;
//# sourceMappingURL=JobV1.js.map