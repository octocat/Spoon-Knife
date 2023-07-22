/// <reference types="node" />
import { PassThrough } from 'stream';
import miniget from 'miniget';
declare namespace m3u8stream {
    interface Options {
        begin?: number | string;
        liveBuffer?: number;
        chunkReadahead?: number;
        highWaterMark?: number;
        requestOptions?: miniget.Options;
        parser?: 'm3u8' | 'dash-mpd';
        id?: string;
    }
    interface Progress {
        num: number;
        size: number;
        duration: number;
        url: string;
    }
    interface Stream extends PassThrough {
        end: () => this;
        on(event: 'progress', listener: (progress: Progress, totalSegments: number, downloadedBytes: number) => void): this;
        on(event: string | symbol, listener: (...args: any) => void): this;
    }
    interface m3u8streamFunc {
        (playlistURL: string, options?: m3u8stream.Options): Stream;
        parseTimestamp(time: number | string): number;
    }
}
declare let m3u8stream: m3u8stream.m3u8streamFunc;
export = m3u8stream;
