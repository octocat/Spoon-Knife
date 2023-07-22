"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const sax_1 = __importDefault(require("sax"));
const parse_time_1 = require("./parse-time");
/**
 * A wrapper around sax that emits segments.
 */
class DashMPDParser extends stream_1.Writable {
    constructor(targetID) {
        super();
        this._parser = sax_1.default.createStream(false, { lowercase: true });
        this._parser.on('error', this.destroy.bind(this));
        let lastTag;
        let currtime = 0;
        let seq = 0;
        let segmentTemplate;
        let timescale, offset, duration, baseURL;
        let timeline = [];
        let getSegments = false;
        let gotSegments = false;
        let isStatic;
        let treeLevel;
        let periodStart;
        const tmpl = (str) => {
            const context = {
                RepresentationID: targetID,
                Number: seq,
                Time: currtime,
            };
            return str.replace(/\$(\w+)\$/g, (m, p1) => `${context[p1]}`);
        };
        this._parser.on('opentag', node => {
            switch (node.name) {
                case 'mpd':
                    currtime =
                        node.attributes.availabilitystarttime ?
                            new Date(node.attributes.availabilitystarttime).getTime() : 0;
                    isStatic = node.attributes.type !== 'dynamic';
                    break;
                case 'period':
                    // Reset everything on <Period> tag.
                    seq = 0;
                    timescale = 1000;
                    duration = 0;
                    offset = 0;
                    baseURL = [];
                    treeLevel = 0;
                    periodStart = parse_time_1.durationStr(node.attributes.start) || 0;
                    break;
                case 'segmentlist':
                    seq = parseInt(node.attributes.startnumber) || seq;
                    timescale = parseInt(node.attributes.timescale) || timescale;
                    duration = parseInt(node.attributes.duration) || duration;
                    offset = parseInt(node.attributes.presentationtimeoffset) || offset;
                    break;
                case 'segmenttemplate':
                    segmentTemplate = node.attributes;
                    seq = parseInt(node.attributes.startnumber) || seq;
                    timescale = parseInt(node.attributes.timescale) || timescale;
                    break;
                case 'segmenttimeline':
                case 'baseurl':
                    lastTag = node.name;
                    break;
                case 's':
                    timeline.push({
                        duration: parseInt(node.attributes.d),
                        repeat: parseInt(node.attributes.r),
                        time: parseInt(node.attributes.t),
                    });
                    break;
                case 'adaptationset':
                case 'representation':
                    treeLevel++;
                    if (!targetID) {
                        targetID = node.attributes.id;
                    }
                    getSegments = node.attributes.id === `${targetID}`;
                    if (getSegments) {
                        if (periodStart) {
                            currtime += periodStart;
                        }
                        if (offset) {
                            currtime -= offset / timescale * 1000;
                        }
                        this.emit('starttime', currtime);
                    }
                    break;
                case 'initialization':
                    if (getSegments) {
                        this.emit('item', {
                            url: baseURL.filter(s => !!s).join('') + node.attributes.sourceurl,
                            seq: seq,
                            init: true,
                            duration: 0,
                        });
                    }
                    break;
                case 'segmenturl':
                    if (getSegments) {
                        gotSegments = true;
                        let tl = timeline.shift();
                        let segmentDuration = ((tl === null || tl === void 0 ? void 0 : tl.duration) || duration) / timescale * 1000;
                        this.emit('item', {
                            url: baseURL.filter(s => !!s).join('') + node.attributes.media,
                            seq: seq++,
                            duration: segmentDuration,
                        });
                        currtime += segmentDuration;
                    }
                    break;
            }
        });
        const onEnd = () => {
            if (isStatic) {
                this.emit('endlist');
            }
            if (!getSegments) {
                this.destroy(Error(`Representation '${targetID}' not found`));
            }
            else {
                this.emit('end');
            }
        };
        this._parser.on('closetag', tagName => {
            switch (tagName) {
                case 'adaptationset':
                case 'representation':
                    treeLevel--;
                    if (segmentTemplate && timeline.length) {
                        gotSegments = true;
                        if (segmentTemplate.initialization) {
                            this.emit('item', {
                                url: baseURL.filter(s => !!s).join('') +
                                    tmpl(segmentTemplate.initialization),
                                seq: seq,
                                init: true,
                                duration: 0,
                            });
                        }
                        for (let { duration: itemDuration, repeat, time } of timeline) {
                            itemDuration = itemDuration / timescale * 1000;
                            repeat = repeat || 1;
                            currtime = time || currtime;
                            for (let i = 0; i < repeat; i++) {
                                this.emit('item', {
                                    url: baseURL.filter(s => !!s).join('') +
                                        tmpl(segmentTemplate.media),
                                    seq: seq++,
                                    duration: itemDuration,
                                });
                                currtime += itemDuration;
                            }
                        }
                    }
                    if (gotSegments) {
                        this.emit('endearly');
                        onEnd();
                        this._parser.removeAllListeners();
                        this.removeAllListeners('finish');
                    }
                    break;
            }
        });
        this._parser.on('text', text => {
            if (lastTag === 'baseurl') {
                baseURL[treeLevel] = text;
                lastTag = null;
            }
        });
        this.on('finish', onEnd);
    }
    _write(chunk, encoding, callback) {
        this._parser.write(chunk);
        callback();
    }
}
exports.default = DashMPDParser;
//# sourceMappingURL=dash-mpd-parser.js.map