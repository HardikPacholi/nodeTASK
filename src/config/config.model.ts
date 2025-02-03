import mongoose, { Schema, Document } from 'mongoose';

interface Config extends Document {
    sleepTime: number;
    requestsPerBatch: number;
    requestsPerSecond: number;
    batchSleep: number;
}

const configSchema = new Schema<Config>({
    sleepTime: { type: Number, default: 30000 }, // 30 seconds
    requestsPerBatch: { type: Number, default: 300 },
    requestsPerSecond: { type: Number, default: 5 },
    batchSleep: { type: Number, default: 10000 }, // 10 seconds between batches
});

const ConfigModel = mongoose.model<Config>('Config', configSchema);

export default ConfigModel;
