export declare type Callback = (err: Error | null, result?: any) => void;
interface Task<T> {
    item: T;
    callback?: Callback;
}
declare type Worker<T> = (item: T, cb: Callback) => void;
export declare class Queue<T = unknown> {
    private _worker;
    private _concurrency;
    tasks: Task<T>[];
    total: number;
    active: number;
    /**
     * A really simple queue with concurrency.
     *
     * @param {Function} worker
     * @param {Object} options
     * @param {!number} options.concurrency
     */
    constructor(worker: Worker<T>, options?: {
        concurrency?: number;
    });
    /**
     * Push a task to the queue.
     *
     *  @param {T} item
     *  @param {!Function} callback
     */
    push(item: T, callback?: Callback): void;
    /**
     * Process next job in queue.
     */
    _next(): void;
    /**
     * Stops processing queued jobs.
     */
    die(): void;
}
export {};
