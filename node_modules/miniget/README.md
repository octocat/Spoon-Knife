# node-miniget

A small http(s) GET library with redirects, retries, reconnects, concatenating or streaming, and no dependencies. This keeps filesize small for potential browser use.

![Depfu](https://img.shields.io/depfu/fent/node-miniget)
[![codecov](https://codecov.io/gh/fent/node-miniget/branch/master/graph/badge.svg)](https://codecov.io/gh/fent/node-miniget)


# Usage

Concatenates a response

```js
const miniget = require('miniget');

miniget('http://mywebsite.com', (err, res, body) => {
  console.log('webpage contents: ', body);
});

// with await
let body = await miniget('http://yourwebsite.com').text();
```

Request can be streamed right away

```js
miniget('http://api.mywebsite.com/v1/messages.json')
  .pipe(someWritableStream());
```


# API

### miniget(url, [options])

Makes a GET request. `url` can be a string or a `URL` object. `options` can have any properties from the [`http.request()` function](https://nodejs.org/api/http.html#http_http_request_options_callback), in addition to

* `maxRedirects` - Default is `10`.
* `maxRetries` - Number of times to retry the request if there is a 500 or connection error. Default is `2`.
* `maxReconnects` - During a big download, if there is a disconnect, miniget can try to reconnect and continue the download where it left off. Default is `0`.
* `backoff` - An object with `inc` and `max` used to calculate how long to wait to retry a request. Default is `{ inc: 100, max: 10000 }`.
* `highWaterMark` - Amount of data to buffer when in stream mode.
* `transform` - Use this to add additional features. Called with the object that `http.get()` or `https.get()` would be called with. Must return a transformed object.
* `acceptEncoding` - An object with encoding name as the key, and the value as a function that returns a decoding stream.
  ```js
  acceptEncoding: { gzip: () => require('zlip').createGunzip(stream) }
  ```
  Given encodings will be added to the `Accept-Encoding` header, and the response will be decoded if the server responds with encoded content.

Defaults are held in `miniget.defaultOptions` and can be adjusted globally.

Miniget returns a readable stream, errors will then be emitted on the stream. Returned stream has additional methods added, and can emit the following events.

### Stream#destroy([error])

Destroys the request.

### Stream#destroyed

Set to `true` after `Stream#destroy()` has been called.

### Stream#text()

Returns a promise that resolves to the concatenated contents of the response.

```js
let body = await miniget('http://yourwebsite.com').text();
```

#### Event: redirect
* `string` - URL redirected to.

Emitted when the request was redirected with a redirection status code.

#### Event: retry
* `number` - Number of retry.
* `Error` - Request or status code error.

Emitted when the request fails, or the response has a status code >= 500.

#### Event: reconnect
* `number` - Number of reconnect.
* `Error` - Request or response error.

Emitted when the request or response fails after download has started.

#### Event: request
* [`http.ClientRequest`](https://nodejs.org/api/http.html#http_class_http_clientrequest) - Request.

Emitted when a video request is made, including after any redirects, retries, and reconnects.

#### Event: response
* [`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) - Response.

Emitted when a video response has been found and has started downloading, including after any successful reconnects.

#### Forwarded events

Any events emitted from the [request](https://nodejs.org/api/http.html#http_class_http_clientrequest) or [response](https://nodejs.org/api/http.html#http_class_http_serverresponse) objects will be forwarded to the miniget stream.

# Install

    npm install miniget


# Tests
Tests are written with [mocha](https://mochajs.org)

```bash
npm test
```
