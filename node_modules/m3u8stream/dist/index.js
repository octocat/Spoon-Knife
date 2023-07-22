"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const stream_1 = require("stream");
const miniget_1 = __importDefault(require("miniget"));
const m3u8_parser_1 = __importDefault(require("./m3u8-parser"));
const dash_mpd_parser_1 = __importDefault(require("./dash-mpd-parser"));
const queue_1 = require("./queue");
const parse_time_1 = require("./parse-time");
const supportedParsers = {
    m3u8: m3u8_parser_1.default,
    'dash-mpd': dash_mpd_parser_1.default,
};
let m3u8stream = ((playlistURL, options = {}) => {
    const stream = new stream_1.PassThrough({ highWaterMark: options.highWaterMark });
    const chunkReadahead = options.chunkReadahead || 3;
    // 20 seconds.
    const liveBuffer = options.liveBuffer || 20000;
    const requestOptions = options.requestOptions;
    const Parser = supportedParsers[options.parser || (/\.mpd$/.test(playlistURL) ? 'dash-mpd' : 'm3u8')];
    if (!Parser) {
        throw TypeError(`parser '${options.parser}' not supported`);
    }
    let begin = 0;
    if (typeof options.begin !== 'undefined') {
        begin = typeof options.begin === 'string' ?
            parse_time_1.humanStr(options.begin) :
            Math.max(options.begin - liveBuffer, 0);
    }
    const forwardEvents = (req) => {
        for (let event of ['abort', 'request', 'response', 'redirect', 'retry', 'reconnect']) {
            req.on(event, stream.emit.bind(stream, event));
        }
    };
    let currSegment;
    const streamQueue = new queue_1.Queue((req, callback) => {
        currSegment = req;
        // Count the size manually, since the `content-length` header is not
        // always there.
        let size = 0;
        req.on('data', (chunk) => size += chunk.length);
        req.pipe(stream, { end: false });
        req.on('end', () => callback(null, size));
    }, { concurrency: 1 });
    let segmentNumber = 0;
    let downloaded = 0;
    const requestQueue = new queue_1.Queue((segment, callback) => {
        let reqOptions = Object.assign({}, requestOptions);
        if (segment.range) {
            reqOptions.headers = Object.assign({}, reqOptions.headers, {
                Range: `bytes=${segment.range.start}-${segment.range.end}`,
            });
        }
        let req = miniget_1.default(new URL(segment.url, playlistURL).toString(), reqOptions);
        req.on('error', callback);
        forwardEvents(req);
        streamQueue.push(req, (_, size) => {
            downloaded += +size;
            stream.emit('progress', {
                num: ++segmentNumber,
                size: size,
                duration: segment.duration,
                url: segment.url,
            }, requestQueue.total, downloaded);
            callback(null);
        });
    }, { concurrency: chunkReadahead });
    const onError = (err) => {
        stream.emit('error', err);
        // Stop on any error.
        stream.end();
    };
    // When to look for items again.
    let refreshThreshold;
    let minRefreshTime;
    let refreshTimeout;
    let fetchingPlaylist = true;
    let ended = false;
    let isStatic = false;
    let lastRefresh;
    const onQueuedEnd = (err) => {
        currSegment = null;
        if (err) {
            onError(err);
        }
        else if (!fetchingPlaylist && !ended && !isStatic &&
            requestQueue.tasks.length + requestQueue.active <= refreshThreshold) {
            let ms = Math.max(0, minRefreshTime - (Date.now() - lastRefresh));
            fetchingPlaylist = true;
            refreshTimeout = setTimeout(refreshPlaylist, ms);
        }
        else if ((ended || isStatic) &&
            !requestQueue.tasks.length && !requestQueue.active) {
            stream.end();
        }
    };
    let currPlaylist;
    let lastSeq;
    let starttime = 0;
    const refreshPlaylist = () => {
        lastRefresh = Date.now();
        currPlaylist = miniget_1.default(playlistURL, requestOptions);
        currPlaylist.on('error', onError);
        forwardEvents(currPlaylist);
        const parser = currPlaylist.pipe(new Parser(options.id));
        parser.on('starttime', (a) => {
            if (starttime) {
                return;
            }
            starttime = a;
            if (typeof options.begin === 'string' && begin >= 0) {
                begin += starttime;
            }
        });
        parser.on('endlist', () => { isStatic = true; });
        parser.on('endearly', currPlaylist.unpipe.bind(currPlaylist, parser));
        let addedItems = [];
        const addItem = (item) => {
            if (!item.init) {
                if (item.seq <= lastSeq) {
                    return;
                }
                lastSeq = item.seq;
            }
            begin = item.time;
            requestQueue.push(item, onQueuedEnd);
            addedItems.push(item);
        };
        let tailedItems = [], tailedItemsDuration = 0;
        parser.on('item', (item) => {
            let timedItem = Object.assign({ time: starttime }, item);
            if (begin <= timedItem.time) {
                addItem(timedItem);
            }
            else {
                tailedItems.push(timedItem);
                tailedItemsDuration += timedItem.duration;
                // Only keep the last `liveBuffer` of items.
                while (tailedItems.length > 1 &&
                    tailedItemsDuration - tailedItems[0].duration > liveBuffer) {
                    const lastItem = tailedItems.shift();
                    tailedItemsDuration -= lastItem.duration;
                }
            }
            starttime += timedItem.duration;
        });
        parser.on('end', () => {
            currPlaylist = null;
            // If we are too ahead of the stream, make sure to get the
            // latest available items with a small buffer.
            if (!addedItems.length && tailedItems.length) {
                tailedItems.forEach(item => { addItem(item); });
            }
            // Refresh the playlist when remaining segments get low.
            refreshThreshold = Math.max(1, Math.ceil(addedItems.length * 0.01));
            // Throttle refreshing the playlist by looking at the duration
            // of live items added on this refresh.
            minRefreshTime =
                addedItems.reduce((total, item) => item.duration + total, 0);
            fetchingPlaylist = false;
            onQueuedEnd(null);
        });
    };
    refreshPlaylist();
    stream.end = () => {
        ended = true;
        streamQueue.die();
        requestQueue.die();
        clearTimeout(refreshTimeout);
        currPlaylist === null || currPlaylist === void 0 ? void 0 : currPlaylist.destroy();
        currSegment === null || currSegment === void 0 ? void 0 : currSegment.destroy();
        stream_1.PassThrough.prototype.end.call(stream, null);
        return stream;
    };
    return stream;
});
m3u8stream.parseTimestamp = parse_time_1.humanStr;
module.exports = m3u8stream;
//# sourceMappingURL=index.js.map