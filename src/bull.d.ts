declare module 'bull' {
    import { EventEmitter } from 'events';

    export interface Job<DataType = any> {
        id: string;
        data: DataType;
    }

    export interface QueueOptions {
        redis?: {
            host: string;
            port: number;
            password?: string;
        };
    }

    export class Queue<DataType = any> extends EventEmitter {
        constructor(name: string, opts?: QueueOptions);
        add(data: DataType, opts?: any): Promise<Job<DataType>>;
        process(callback: (job: Job<DataType>) => Promise<void>): void;
    }
}





  