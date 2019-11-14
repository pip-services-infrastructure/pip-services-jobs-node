"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobV1 {
    constructor(newJob) {
        let curentDt = new Date();
        this.created = curentDt;
        this.retries = 0;
        this.completed = null;
        this.started = null;
        this.locked_until = null;
        this.execute_until = null;
        if (newJob) {
            this.type = newJob.type;
            this.ref_id = newJob.ref_id;
            this.params = newJob.params;
            if (newJob.ttl != null && newJob.ttl > 0) {
                this.execute_until = new Date(curentDt.valueOf() + newJob.ttl);
            }
        }
    }
}
exports.JobV1 = JobV1;
//# sourceMappingURL=JobV1.js.map