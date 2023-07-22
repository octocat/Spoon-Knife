"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    /**
     * A really simple queue with concurrency.
     *
     * @param {Function} worker
     * @param {Object} options
     * @param {!number} options.concurrency
     */
    constructor(worker, options = {}) {
        this._worker = worker;
        this._concurrency = options.concurrency || 1;
        this.tasks = [];
        this.total = 0;
        this.active = 0;
    }
    /**
     * Push a task to the queue.
     *
     *  @param {T} item
     *  @param {!Function} callback
     */
    push(item, callback) {
        this.tasks.push({ item, callback });
        this.total++;
        this._next();
    }
    /**
     * Process next job in queue.
     */
    _next() {
        if (this.active >= this._concurrency || !this.tasks.length) {
            return;
        }
        const { item, callback } = this.tasks.shift();
        let callbackCalled = false;
        this.active++;
        this._worker(item, (err, result) => {
            if (callbackCalled) {
                return;
            }
            this.active--;
            callbackCalled = true;
            callback === null || callback === void 0 ? void 0 : callback(err, result);
            this._next();
        });
    }
    /**
     * Stops processing queued jobs.
     */
    die() {
        this.tasks = [];
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map