"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.durationStr = exports.humanStr = void 0;
const numberFormat = /^\d+$/;
const timeFormat = /^(?:(?:(\d+):)?(\d{1,2}):)?(\d{1,2})(?:\.(\d{3}))?$/;
const timeUnits = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
};
/**
 * Converts human friendly time to milliseconds. Supports the format
 * 00:00:00.000 for hours, minutes, seconds, and milliseconds respectively.
 * And 0ms, 0s, 0m, 0h, and together 1m1s.
 *
 * @param {number|string} time
 * @returns {number}
 */
exports.humanStr = (time) => {
    if (typeof time === 'number') {
        return time;
    }
    if (numberFormat.test(time)) {
        return +time;
    }
    const firstFormat = timeFormat.exec(time);
    if (firstFormat) {
        return (+(firstFormat[1] || 0) * timeUnits.h) +
            (+(firstFormat[2] || 0) * timeUnits.m) +
            (+firstFormat[3] * timeUnits.s) +
            +(firstFormat[4] || 0);
    }
    else {
        let total = 0;
        const r = /(-?\d+)(ms|s|m|h)/g;
        let rs;
        while ((rs = r.exec(time)) !== null) {
            total += +rs[1] * timeUnits[rs[2]];
        }
        return total;
    }
};
/**
 * Parses a duration string in the form of "123.456S", returns milliseconds.
 *
 * @param {string} time
 * @returns {number}
 */
exports.durationStr = (time) => {
    let total = 0;
    const r = /(\d+(?:\.\d+)?)(S|M|H)/g;
    let rs;
    while ((rs = r.exec(time)) !== null) {
        total += +rs[1] * timeUnits[rs[2].toLowerCase()];
    }
    return total;
};
//# sourceMappingURL=parse-time.js.map