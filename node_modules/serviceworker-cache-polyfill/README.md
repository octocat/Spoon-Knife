# ServiceWorker cache polyfill

[Obsolete](https://github.com/coonsta/cache-polyfill/issues/17#issuecomment-158628413) polyfill for the [ServiceWorker cache API](http://slightlyoff.github.io/ServiceWorker/spec/service_worker/#cache-storage-interface). Chrome 46 and Opera 33 support `addAll` now.

## Usage

Take [serviceworker-cache-polyfill.js](https://github.com/coonsta/cache-polyfill/blob/master/index.js), then in your ServiceWorker script:

```js
importScripts('serviceworker-cache-polyfill.js');

// example usage:
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('demo-cache').then(function(cache) {
      return cache.put('/', new Response("From the cache!"));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || new Response("Nothing in the cache for this request");
    })
  );
});
```

## License

Copyright 2015 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Please note: this is not a Google product
