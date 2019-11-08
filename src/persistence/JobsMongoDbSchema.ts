import { Schema } from 'mongoose';
let Mixed = Schema.Types.Mixed;

export let JobsMongoDbSchema = function (collection?: string) {
    collection = collection || 'jobs';

    let schema = new Schema(
        {
            _id: { type: String },
            type: { type: String, required: true },
            ref_obj_id: { type: String, required: true },
            params: { type: Mixed, required: false },
            timeout: { type: Date, required: true },
            created: { type: Date, required: true },
            started: { type: Date, required: false },
            locked_until: { type: Date, required: false },
            execute_until: { type: Date, required: true },
            completed: { type: Date, required: false },
            lock: { type: Boolean, required: true },
            try_counter: { type: Number, required: true }
        },
        {
            collection: collection,
            autoIndex: true
        }
    );

    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return schema;
}