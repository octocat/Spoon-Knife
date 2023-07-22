/// <reference types="node" />
import { RequestOptions } from 'http';
import { PassThrough, Transform } from 'stream';
declare namespace Miniget {
    interface Options extends RequestOptions {
        maxRedirects?: number;
        maxRetries?: number;
        maxReconnects?: number;
        backoff?: {
            inc: number;
            max: number;
        };
        highWaterMark?: number;
        transform?: (parsedUrl: RequestOptions) => RequestOptions;
        acceptEncoding?: {
            [key: string]: () => Transform;
        };
    }
    interface DefaultOptions extends Options {
        maxRedirects: number;
        maxRetries: number;
        maxReconnects: number;
        backoff: {
            inc: number;
            max: number;
        };
    }
    type defaultOptions = Miniget.Options;
    type MinigetError = Error;
    interface Stream extends PassThrough {
        abort: (err?: Error) => void;
        aborted: boolean;
        destroy: (err?: Error) => this;
        destroyed: boolean;
        text: () => Promise<string>;
        on(event: 'reconnect', listener: (attempt: number, err?: Miniget.MinigetError) => void): this;
        on(event: 'retry', listener: (attempt: number, err?: Miniget.MinigetError) => void): this;
        on(event: 'redirect', listener: (url: string) => void): this;
        on(event: string | symbol, listener: (...args: any) => void): this;
    }
}
declare function Miniget(url: string | URL, options?: Miniget.Options): Miniget.Stream;
declare namespace Miniget {
    var defaultOptions: {
        maxRedirects: number;
        maxRetries: number;
        maxReconnects: number;
        backoff: {
            inc: number;
            max: number;
        };
    };
    var MinigetError: {
        new (message: string, statusCode?: number | undefined): {
            statusCode?: number | undefined;
            name: string;
            message: string;
            stack?: string | undefined;
        };
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
}
export = Miniget;
