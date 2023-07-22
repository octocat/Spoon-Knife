/**
 * Converts human friendly time to milliseconds. Supports the format
 * 00:00:00.000 for hours, minutes, seconds, and milliseconds respectively.
 * And 0ms, 0s, 0m, 0h, and together 1m1s.
 *
 * @param {number|string} time
 * @returns {number}
 */
export declare const humanStr: (time: number | string) => number;
/**
 * Parses a duration string in the form of "123.456S", returns milliseconds.
 *
 * @param {string} time
 * @returns {number}
 */
export declare const durationStr: (time: string) => number;
