/// <reference types="node" />
import { Writable } from 'stream';
import { Parser } from './parser';
/**
 * A very simple m3u8 playlist file parser that detects tags and segments.
 */
export default class m3u8Parser extends Writable implements Parser {
    private _lastLine;
    private _seq;
    private _nextItemDuration;
    private _nextItemRange;
    private _lastItemRangeEnd;
    constructor();
    private _parseAttrList;
    private _parseRange;
    _parseLine(line: string): void;
    _write(chunk: Buffer, encoding: string, callback: () => void): void;
}
