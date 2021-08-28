#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

# Service Worker Precache

Service Worker Precache is a module for generating a service worker that
precaches resources. It integrates with your build process. Once configured, it
detects all your static resources (HTML, JavaScript, CSS, images, etc.) and
generates a hash of each file's contents. Information about each file's URL and
versioned hash are stored in the generated service worker file, along with logic
to serve those files cache-first, and automatically keep those files up to date
when changes are detected in subsequent builds.

Serving your local static resources cache-first means that you can get all the
crucial scaffolding for your web app—your App Shell—on the screen without having
to wait for any network responses.

The module can be used in JavaScript-based build scripts,
like those written with [`gulp`](http://gulpjs.com/), and it also provides a
[command-line interface](#command-line-interface). You can use the module
directly, or if you'd prefer, use one of the [wrappers](#wrappers-and-starter-kits)
around `sw-precache` for specific build environments, like
[`webpack`](https://webpack.github.io/).

It can be [used alongside](sw-precache-and-sw-toolbox.md) the [`sw-toolbox`](https://github.com/GoogleChrome/sw-toolbox)
library, which works well when following the App Shell + dynamic content model.

The full documentation is in this README, and the
[getting started guide](GettingStarted.md) provides a quicker jumping off point.

To learn more about the internals of the generated service worker, you can read
[this deep-dive](https://medium.com/@Huxpro/how-does-sw-precache-works-2d99c3d3c725)
by [Huang Xuan](https://twitter.com/Huxpro).


# Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)
  - [Overview](#overview)
  - [Example](#example)
  - [Considerations](#considerations)
  - [Command-line interface](#command-line-interface)
- [Runtime Caching](#runtime-caching)
- [API](#api)
  - [Methods](#methods)
    - [generate(options, callback)](#generateoptions-callback)
    - [write(filePath, options, callback)](#writefilepath-options-callback)
  - [Options Parameter](#options-parameter)
    - [cacheId [String]](#cacheid-string)
    - [clientsClaim [Boolean]](#clientsclaim-boolean)
    - [directoryIndex [String]](#directoryindex-string)
    - [dontCacheBustUrlsMatching [Regex]](#dontcachebusturlsmatching-regex)
    - [dynamicUrlToDependencies [Object&#x27e8;String,Buffer,Array&#x27e8;String&#x27e9;&#x27e9;]](#dynamicurltodependencies-objectstringbufferarraystring)
    - [handleFetch [boolean]](#handlefetch-boolean)
    - [ignoreUrlParametersMatching [Array&#x27e8;Regex&#x27e9;]](#ignoreurlparametersmatching-arrayregex)
    - [importScripts [Array&#x27e8;String&#x27e9;]](#importscripts-arraystring)
    - [logger [function]](#logger-function)
    - [maximumFileSizeToCacheInBytes [Number]](#maximumfilesizetocacheinbytes-number)
    - [navigateFallback [String]](#navigatefallback-string)
    - [navigateFallbackWhitelist [Array&#x27e8;RegExp&#x27e9;]](#navigatefallbackwhitelist-arrayregexp)
    - [replacePrefix [String]](#replaceprefix-string)
    - [runtimeCaching [Array&#x27e8;Object&#x27e9;]](#runtimecaching-arrayobject)
    - [skipWaiting [Boolean]](#skipwaiting-boolean)
    - [staticFileGlobs [Array&#x27e8;String&#x27e9;]](#staticfileglobs-arraystring)
    - [stripPrefix [String]](#stripprefix-string)
    - [stripPrefixMulti [Object]](#stripprefixmulti-object)
    - [templateFilePath [String]](#templatefilepath-string)
    - [verbose [boolean]](#verbose-boolean)
- [Wrappers and Starter Kits](#wrappers-and-starter-kits)
  - [CLIs](#clis)
  - [Starter Kits](#starter-kits)
  - [Recipes for writing a custom wrapper](#recipes-for-writing-a-custom-wrapper)
- [Acknowledgements](#acknowledgements)
- [Future of Service Worker tooling](#future-of-service-worker-tooling)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Install

Local build integration:
```sh
$ npm install --save-dev sw-precache
```

Global command-line interface:
```sh
$ npm install --global sw-precache
```


## Usage

### Overview

1. **Make sure your site is served using HTTPS!**
Service worker functionality is only available on pages that are accessed via HTTPS.
(`http://localhost` will also work, to facilitate testing.) The rationale for this restriction is
outlined in the
["Prefer Secure Origins For Powerful New Features" document](http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features).

2. **Incorporate `sw-precache` into your `node`-based build script.** It should
work well with either `gulp` or `Grunt`, or other build scripts that run on
`node`. In fact, we've provided examples of both in the `demo/` directory. Each
build script in `demo` has a function called `writeServiceWorkerFile()` that
shows how to use the API. Both scripts generate fully-functional JavaScript code
that takes care of precaching and fetching all the resources your site needs to
function offline. There is also a [command-line interface](#command-line-interface)
available, for those using alternate build setups.

3. **Register the service worker JavaScript.** The JavaScript that's generated
needs to be registered as the controlling service worker for your pages. This
technically only needs to be done from within a top-level "entry" page for your
site, since the registration includes a [`scope`](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-scope)
which will apply to all pages underneath your top-level page. [`service-worker-registration.js`](/demo/app/js/service-worker-registration.js) is a sample
script that illustrates the best practices for registering the generated service
worker and handling the various [lifecycle](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-state.1) events.

### Example

The project's [sample `gulpfile.js`](/demo/gulpfile.js) illustrates the full use of sw-precache
in context. (Note that the sample gulpfile.js is the one in the `demo` folder,
not the one in the root of the project.) You can run the sample by cloning this
repo, using [`npm install`](https://docs.npmjs.com/) to pull in the
dependencies, changing to the `demo/` directory, running `` `npm bin`/gulp serve-dist ``, and
then visiting http://localhost:3000.

There's also a [sample `Gruntfile.js`](/demo/Gruntfile.js) that shows service worker generation in
Grunt. Though, it doesn't run a server on localhost.

Here's a simpler gulp example for a basic use case. It assumes your site's resources are located under
`app` and that you'd like to cache *all* your JavaScript, HTML, CSS, and image files.

```js
gulp.task('generate-service-worker', function(callback) {
  var swPrecache = require('sw-precache');
  var rootDir = 'app';

  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});
```

This task will create `app/service-worker.js`, which your client pages need to
[register](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#navigator-service-worker-register) before it can take control of your site's
pages. [`service-worker-registration.js`](/demo/app/js/service-worker-registration.js) is a ready-to-
use script to handle registration.


### Considerations

- Service worker caching should be considered a progressive enhancement. If you follow the model of
conditionally registering a service worker only if it's supported (determined by
`if('serviceWorker' in navigator)`), you'll get offline support on browsers with service workers and
on browsers that don't support service workers, the offline-specific code will never be called.
There's no overhead/breakage for older browsers if you add `sw-precache` to your build.

- **All** resources that are precached will be fetched by a service worker running in a separate
thread as soon as the service worker is installed. You should be judicious in what you list in the
`dynamicUrlToDependencies` and `staticFileGlobs` options, since listing files that are non-essential
(large images that are not shown on every page, for instance) will result in browsers downloading
more data than is strictly necessary.

- Precaching doesn't make sense for all types of resources (see the previous
point). Other caching strategies, like those outlined in the [Offline Cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/), can be used in
conjunction with `sw-precache` to provide the best experience for your users. If
you do implement additional caching logic, put the code in a separate JavaScript
file and include it using the `importScripts()` method.

- `sw-precache` uses a [cache-first](http://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network) strategy, which results in a copy of
any cached content being returned without consulting the network. A useful
pattern to adopt with this strategy is to display a toast/alert to your users
when there's new content available, and give them an opportunity to reload the
page to pick up that new content (which the service worker will have added to
the cache, and will be available at the next page load). The sample [`service-worker-registration.js`](/demo/app/js/service-worker-registration.js) file [illustrates](https://github.com/GoogleChrome/sw-precache/blob/7688ee8ccdaddd9171af352384d04d16d712f9d3/demo/app/js/service-worker-registration.js#L51)
the service worker lifecycle event you can listen for to trigger this message.


### Command-line interface

For those who would prefer not to use `sw-precache` as part of a `gulp` or
`Grunt` build, there's a [command-line interface](cli.js) which supports the
[options listed](#options-parameter) in the API, provided via flags or an
external JavaScript configuration file.

**Warning:** When using `sw-precache` "by hand", outside of an automated build process, it's your
responsibility to re-run the command each time there's a change to any local resources! If `sw-precache`
is not run again, the previously cached local resources will be reused indefinitely.

Sensible defaults are assumed for options that are not provided. For example, if you are inside
the top-level directory that contains your site's contents, and you'd like to generate a
`service-worker.js` file that will automatically precache all of the local files, you can simply run

```sh
$ sw-precache
```

Alternatively, if you'd like to only precache `.html` files that live within `dist/`, which is a
subdirectory of the current directory, you could run

```sh
$ sw-precache --root=dist --static-file-globs='dist/**/*.html'
```

**Note:** Be sure to use quotes around parameter values that have special meanings
to your shell (such as the `*` characters in the sample command line above,
for example).

Finally, there's support for passing complex configurations using `--config <file>`.
Any of the options from the file can be overridden via a command-line flag.
We strongly recommend passing it an external JavaScript file defining config via
[`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports).
For example, assume there's a `path/to/sw-precache-config.js` file that contains:

```js
module.exports = {
  staticFileGlobs: [
    'app/css/**.css',
    'app/**.html',
    'app/images/**.*',
    'app/js/**.js'
  ],
  stripPrefix: 'app/',
  runtimeCaching: [{
    urlPattern: /this\\.is\\.a\\.regex/,
    handler: 'networkFirst'
  }]
};
```

That file could be passed to the command-line interface, while also setting the
`verbose` option, via

```sh
$ sw-precache --config=path/to/sw-precache-config.js --verbose
```

This provides the most flexibility, such as providing a regular expression for
the `runtimeCaching.urlPattern` option.

We also support passing in a JSON file for `--config`, though this provides
less flexibility:

```json
{
  "staticFileGlobs": [
    "app/css/**.css",
    "app/**.html",
    "app/images/**.*",
    "app/js/**.js"
  ],
  "stripPrefix": "app/",
  "runtimeCaching": [{
    "urlPattern": "/express/style/path/(.*)",
    "handler": "networkFirst"
  }]
}
```

## Runtime Caching

It's often desireable, even necessary to use precaching and runtime caching together. You may have seen our [`sw-toolbox`](https://github.com/GoogleChrome/sw-toolbox) tool, which handles runtime caching, and wondered how to use them together. Fortunately, `sw-precache` handles this for you.

The `sw-precache` module has the ability to include the `sw-toolbox` code and configuration alongside its own configuration. Using the `runtimeCaching` configuration option in `sw-precache` ([see below](#runtimecaching-arrayobject)) is a shortcut that accomplishes what you could do manually by importing `sw-toolbox` in your service worker and writing your own routing rules.

## API

### Methods

The `sw-precache` module exposes two methods: `generate` and `write`.

#### generate(options, callback)

`generate` takes in [options](#options), generates a service worker
from them and passes the result to a callback function, which must
have the following interface:

`callback(error, serviceWorkerString)`

In the 1.x releases of `sw-precache`, this was the default and only method
exposed by the module.

Since 2.2.0, `generate()` also returns a
[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

#### write(filePath, options, callback)
`write` takes in [options](#options), generates a service worker from them,
and writes the service worker to a specified file. This method always
invokes `callback(error)`. If no error was found, the `error` parameter will
be `null`

Since 2.2.0, `write()` also returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### Options Parameter

Both the `generate()` and `write()` methods take the same options.

#### cacheId [String]
A string used to distinguish the caches created by different web applications that are served off
of the same origin and path. While serving completely different sites from the same URL is not
likely to be an issue in a production environment, it avoids cache-conflicts when testing various
projects all served off of `http://localhost`. You may want to set it to, e.g., the `name`
property from your `package.json`.

_Default_: `''`

#### clientsClaim [Boolean]
Controls whether or not the generated service worker will call
[`clients.claim()`](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim)
inside the `activate` handler.

Calling `clients.claim()` allows a newly registered service worker to take
control of a page immediately, instead of having to wait until the next page
navigation.

_Default_: `true`

#### directoryIndex [String]
Sets a default filename to return for URL's formatted like directory paths (in
other words, those ending in `'/'`). `sw-precache` will take that translation
into account and serve the contents a relative `directoryIndex` file when
there's no other match for a URL ending in `'/'`. To turn off this behavior,
set `directoryIndex` to `false` or `null`. To override this behavior for one
or more URLs, use the `dynamicUrlToDependencies` option to explicitly set up
mappings between a directory URL and a corresponding file.

_Default_: `'index.html'`

#### dontCacheBustUrlsMatching [Regex]
It's very important that the requests `sw-precache` makes to populate your cache
result in the most up-to-date version of a resource at a given URL. Requests
that are fulfilled with out-of-date responses (like those found in your
browser's HTTP cache) can end up being read from the service worker's cache
indefinitely. Jake Archibald's [blog post](https://jakearchibald.com/2016/caching-best-practices/#a-service-worker-can-extend-the-life-of-these-bugs)
provides more context about this problem.

In the interest of avoiding that scenario, `sw-precache` will, by default,
append a cache-busting parameter to the end of each URL it requests when
populating or updating its cache. Developers who are explicitly doing "the right
thing" when it comes to setting HTTP caching headers on their responses might
want to opt out of this cache-busting. For example, if all of your static
resources already include versioning information in their URLs (via a tool like
[`gulp-rev`](https://github.com/sindresorhus/gulp-rev)), and are served with
long-lived HTTP caching headers, then the extra cache-busting URL parameter
is not needed, and can be safely excluded.

`dontCacheBustUrlsMatching` gives you a way of opting-in to skipping the cache
busting behavior for a subset of your URLs (or all of them, if a catch-all value
like `/./` is used).
If set, then the [pathname](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname)
of each URL that's prefetched will be matched against this value.
If there's a match, then the URL will be prefetched as-is, without an additional
cache-busting URL parameter appended.

Note: Prior to `sw-precache` v5.0.0, `dontCacheBustUrlsMatching` matched against
the entire request URL. As of v5.0.0, it only matches against the URL's
[pathname](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname).

_Default_: not set

#### dynamicUrlToDependencies [Object&#x27e8;String,Buffer,Array&#x27e8;String&#x27e9;&#x27e9;]
Maps a dynamic URL string to an array of all the files that URL's contents
depend on. E.g., if the contents of `/pages/home` are generated server-side via
the templates `layout.jade` and `home.jade`, then specify `'/pages/home':
['layout.jade', 'home.jade']`. The MD5 hash is used to determine whether
`/pages/home` has changed will depend on the hashes of both `layout.jade` and
`home.jade`.

An alternative value for the mapping is supported as well. You can specify
a string or a Buffer instance rather than an array of file names. If you use this option, then the
hash of the string/Buffer will be used to determine whether the URL used as a key has changed.
For example, `'/pages/dynamic': dynamicStringValue` could be used if the contents of
`/pages/dynamic` changes whenever the string stored in `dynamicStringValue` changes.

_Default_: `{}`

#### handleFetch [boolean]
Determines whether the `fetch` event handler is included in the generated
service worker code. It is useful to set this to `false` in development builds,
to ensure that features like live reload still work. Otherwise, the content
would always be served from the service worker cache.

_Default_: `true`

#### ignoreUrlParametersMatching [Array&#x27e8;Regex&#x27e9;]
`sw-precache` finds matching cache entries by doing a comparison with the full request URL. It's
common for sites to support URL query parameters that don't affect the site's content and should
be effectively ignored for the purposes of cache matching. One example is the
[`utm_`-prefixed](https://support.google.com/analytics/answer/1033867) parameters used for tracking
campaign performance. By default, `sw-precache` will ignore `key=value` when `key` matches _any_ of
the regular expressions provided in this option.
To ignore all parameters, use `[/./]`. To take all parameters into account when matching, use `[]`.

_Default_: `[/^utm_/]`

#### importScripts [Array&#x27e8;String&#x27e9;]
Writes calls to [`importScripts()`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/basic_usage#Importing_scripts_and_libraries)
to the resulting service worker to import the specified scripts.

_Default_: `[]`

#### logger [function]

Specifies a callback function for logging which resources are being precached and
a precache size. Use `function() {}` if you'd prefer that nothing is logged.
Within a `gulp` script, it's recommended that you use [`gulp-util`](https://github.com/gulpjs/gulp-util) and pass in `gutil.log`.

_Default_: `console.log`

#### maximumFileSizeToCacheInBytes [Number]
Sets the maximum allowed size for a file in the precache list.

_Default_: `2097152` (2 megabytes)

#### navigateFallback [String]
Sets an HTML document to use as a fallback for URLs not found in the `sw-precache` cache. This
fallback URL needs to be cached via `staticFileGlobs` or `dynamicUrlToDependencies` otherwise it
won't work.

```js
// via staticFileGlobs
staticFileGlobs: ['/shell.html']
navigateFallback: '/shell.html'

// via dynamicUrlToDependencies
dynamicUrlToDependencies: {
  '/shell': ['/shell.hbs']
},
navigateFallback: '/shell'
```

This comes in handy when used with a web application that performs client-side URL routing
using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History). It allows any
arbitrary URL that the client generates to map to a fallback cached HTML entry. This fallback entry
ideally should serve as an "application shell" that is able to load the appropriate resources
client-side, based on the request URL.

**Note:** This is **not** intended to be used to route failed navigations to a
generic "offline fallback" page. The `navigateFallback` page is used whether the
browser is online or offline. If you want to implement an "offline fallback",
then using an approach similar to [this example](https://googlechrome.github.io/samples/service-worker/custom-offline-page/)
is more appropriate.

_Default_: `''`

#### navigateFallbackWhitelist [Array&#x27e8;RegExp&#x27e9;]
Works to limit the effect of `navigateFallback`, so that the fallback only
applies to requests for URLs with paths that match at least one
[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

This option is useful if you want to fallback to the cached App Shell for
certain specific subsections of your site, but not have that behavior apply
to all of your site's URLs.

For example, if you would like to have `navigateFallback` only apply to
navigation requests to URLs whose path begins with `/guide/`
(e.g. `https://example.com/guide/1234`), the following configuration could be
used:

```js
navigateFallback: '/shell',
navigateFallbackWhitelist: [/^\/guide\//]
```

If set to `[]` (the default), the whitelist will be effectively bypassed, and
`navigateFallback` will apply to all navigation requests, regardless of URL.

_Default_: `[]`

#### replacePrefix [String]
Replaces a specified string at the beginning of path URL's at runtime. Use this
option when you are serving static files from a different directory at runtime
than you are at build time. For example, if your local files are under
`dist/app/` but your static asset root is at `/public/`, you'd strip 'dist/app/'
and replace it with '/public/'.

_Default_: `''`

#### runtimeCaching [Array&#x27e8;Object&#x27e9;]
Configures runtime caching for dynamic content. If you use this option, the `sw-toolbox`
library configured with the caching strategies you specify will automatically be included in
your generated service worker file.

Each `Object` in the `Array` needs a `urlPattern`, which is either a
[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
or a string, following the conventions of the `sw-toolbox` library's
[routing configuration](https://googlechrome.github.io/sw-toolbox/api.html#main). Also required is
a `handler`, which should be either a string corresponding to one of the
[built-in handlers](https://googlechrome.github.io/sw-toolbox/api.html#handlers) under the `toolbox.` namespace, or a function corresponding to your custom
[request handler](https://googlechrome.github.io/sw-toolbox/api.html#handlers).
Optionally, `method` can be added to specify one of the [supported HTTP methods](https://googlechrome.github.io/sw-toolbox/api.html#expressive-approach) (_default: `'get'`_). There is also
support for `options`, which corresponds to the same options supported by a
[`sw-toolbox` handler](https://googlechrome.github.io/sw-toolbox/api.html#handlers).

For example, the following defines runtime caching behavior for two different URL patterns. It uses a
different handler for each, and specifies a dedicated cache with maximum size for requests
that match `/articles/`:

```js
runtimeCaching: [{
  urlPattern: /^https:\/\/example\.com\/api/,
  handler: 'networkFirst'
}, {
  urlPattern: /\/articles\//,
  handler: 'fastest',
  options: {
    cache: {
      maxEntries: 10,
      name: 'articles-cache'
    }
  }
}]
```

The [`sw-precache` + `sw-toolbox` explainer](sw-precache-and-sw-toolbox.md) has
more information about how and why you'd use both libraries together.

_Default_: `[]`

#### skipWaiting [Boolean]
Controls whether or not the generated service worker will call
[`skipWaiting()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting)
inside the `install` handler.

By default, when there's an update to a previously installed
service worker, then the new service worker delays activation and stays in a
`waiting` state until all pages controlled by the old service worker are
unloaded. Calling `skipWaiting()` allows a newly registered service worker to
bypass the `waiting` state.

When `skipWaiting` is `true`, the new service worker's `activate` handler will
be called immediately, and any out of date cache entries from the previous
service worker will be deleted. Please keep this in mind if you rely on older
cached resources to be available throughout the page's lifetime, because, for
example, you [defer the loading of some resources](https://github.com/GoogleChrome/sw-precache/issues/180)
until they're needed at runtime.

_Default_: `true`

#### staticFileGlobs [Array&#x27e8;String&#x27e9;]
An array of one or more string patterns that will be passed in to
[`glob`](https://github.com/isaacs/node-glob).
All files matching these globs will be automatically precached by the generated service worker.
You'll almost always want to specify something for this.

_Default_: `[]`

#### stripPrefix [String]
Removes a specified string from the beginning of path URL's at runtime. Use this
option when there's a discrepancy between a relative path at build time and
the same path at run time. For example, if all your local files are under
`dist/app/` and your web root is also at `dist/app/`, you'd strip that prefix
from the start of each local file's path in order to get the correct relative
URL.

_Default_: `''`

#### stripPrefixMulti [Object]
Maps mutliple strings to be stripped and replaced from the beginning of URL paths at runtime.
Use this option when you have multiple discrepancies between relative paths at build time and
the same path at run time.
If `stripPrefix` and `replacePrefix` are not equal to `''`, they are automatically added to this option.
```js
stripPrefixMulti: {
  'www-root/public-precached/': 'public/',
  'www-root/public/': 'public/'
}
```

_Default_: `{}`

#### templateFilePath [String]

The path to the  ([lo-dash](https://lodash.com/docs#template)) template used to
generate `service-worker.js`. If you need to add additional functionality to the
generated service worker code, it's recommended that you use the
[`importScripts`](#importscripts-arraystring) option to include extra JavaScript rather than
using a different template. But if you do need to change the basic generated
service worker code, please make a copy of the [original template](https://github.com/googlechrome/sw-precache/blob/master/service-worker.tmpl),
modify it locally, and use this option to point to your template file.

_Default_: `service-worker.tmpl` (in the directory that this module lives in)

#### verbose [boolean]
Determines whether there's log output for each individual static/dynamic resource that's precached.
Even if this is set to false, there will be a final log entry indicating the total size of all
precached resources.

_Default_: `false`


## Wrappers and Starter Kits

While it's possible to use the `sw-precache` module's API directly within any
JavaScript environment, several wrappers have been developed by members of the
community tailored to specific build environments. They include:
- [`sw-precache-webpack-plugin`](https://www.npmjs.com/package/sw-precache-webpack-plugin)
- [`sw-precache-brunch`](https://www.npmjs.com/package/sw-precache-brunch)
- [`grunt-sw-precache`](https://www.npmjs.com/package/grunt-sw-precache)
- [`exhibit-builder-sw-precache`](https://www.npmjs.com/package/exhibit-builder-sw-precache)

There are also several starter kits or scaffolding projects that incorporate
`sw-precache` into their build process, giving you a full service worker out of
the box. The include:

### CLIs

- [`polymer-cli`](https://github.com/Polymer/polymer-cli)
- [`create-react-pwa`](https://github.com/jeffposnick/create-react-pwa)

### Starter Kits

- [`react-redux-universal-hot-example`](https://github.com/bertho-zero/react-redux-universal-hot-example)
- [Polymer Starter Kit](https://github.com/polymerelements/polymer-starter-kit)
- [Web Starter Kit](https://github.com/google/web-starter-kit)

### Recipes for writing a custom wrapper

While there are not always ready-to-use wrappers for specific environments, this list contains some recipes to integrate `sw-precache` in your workflow:

- [Gradle wrapper for offline JavaDoc](https://gist.github.com/TimvdLippe/4c39b99e3b0ffbcdd8814a31e2969ed1)
- [Brunch starter for Phoenix Framework](https://gist.github.com/natecox/b19c4e08408a5bf0d4cf4d74f1902260)

## Acknowledgements

Thanks to [Sindre Sorhus](https://github.com/sindresorhus) and
[Addy Osmani](https://github.com/addyosmani) for their advice and code reviews.
[Jake Archibald](https://github.com/jakearchibald) was kind enough to review the service worker logic.

## Future of Service Worker tooling

Both sw-precache and sw-toolbox are **actively maintained** and we plan to continue supporting them. A large number of [production](https://medium.com/dev-channel/progressive-web-app-libraries-in-production-b52cad37d34#.16kxwhu92) Progressive Web Apps are successfully using them today and we are happy to review issues or PRs related to either project.

In parallel, we are working on the next generation of Service Worker tooling over in [Workbox](https://github.com/GoogleChrome/workbox). This new work is more modular and will enable a number of libraries with additional capabilities to be built. We will announce further plans around the roadmap for this work in the future.


## License

Copyright © 2017 Google, Inc.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License");
you may not use this file except in compliance with the License. You may
obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[npm-url]: https://npmjs.org/package/sw-precache
[npm-image]: https://badge.fury.io/js/sw-precache.svg
[travis-url]: https://travis-ci.org/GoogleChrome/sw-precache
[travis-image]: https://travis-ci.org/GoogleChrome/sw-precache.svg?branch=master
[daviddm-url]: https://david-dm.org/googlechrome/sw-precache.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/googlechrome/sw-precache
