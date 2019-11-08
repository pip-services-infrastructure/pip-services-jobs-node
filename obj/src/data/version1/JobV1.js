"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobV1 {
    constructor(newJob) {
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
exports.JobV1 = JobV1;
//# sourceMappingURL=JobV1.js.map