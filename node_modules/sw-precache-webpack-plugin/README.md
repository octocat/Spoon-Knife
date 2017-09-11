# SW Precache Webpack Plugin
[![NPM version][npm-img]][npm-url]
[![NPM downloads][npm-downloads-img]][npm-url]
[![CircleCI][circleci-img]][circleci-url]

__`SWPrecacheWebpackPlugin`__ is a [webpack][webpack] plugin for using [service workers][sw-guide] to cache your external project dependencies. It will generate a service worker file using [sw-precache][sw-precache] and add it to your build directory.


## Install
```bash
npm install --save-dev sw-precache-webpack-plugin
```

## Basic Usage
A simple configuration example that will work well in most production environments. Based on the configuration used in [create-react-app].
```javascript
var path = require('path');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const PUBLIC_PATH = 'https://www.my-project-name.com/';  // webpack needs the trailing slash for output.publicPath

module.exports = {

  entry: {
    main: path.resolve(__dirname, 'src/index'),
  },

  output: {
    path: path.resolve(__dirname, 'src/bundles/'),
    filename: '[name]-[hash].js',
    publicPath: PUBLIC_PATH,
  },

  plugins: [
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'my-project-name',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: PUBLIC_PATH + 'index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),
  ],
}
```

This will generate a new service worker at `src/bundles/service-worker.js`.
Then you would just register it in your application:

```javascript
(function() {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/my-service-worker.js');
  }
})();
```

[Another example of registering a service worker is provided by GoogleChrome/sw-precache][sw-precache-registration-example]

## Configuration
You can pass a hash of configuration options to `SWPrecacheWebpackPlugin`:

__plugin options__:
* `filename`: `[String]` - Service worker filename, default is `service-worker.js`
* `filepath`: `[String]` - Service worker path and name, default is to use `webpack.output.path` + `options.filename`. This will override `filename`. *Warning: Make the service worker available in the same directory it will be needed. This is because the scope of the service worker is defined by the directory the worker exists.*
* `staticFileGlobsIgnorePatterns`: `[RegExp]` - Define an optional array of regex patterns to filter out of staticFileGlobs (see below)
* `mergeStaticsConfig`: `[boolean]` - Merge provided staticFileGlobs and stripPrefixMulti with webpack's config, rather than having those take precedence, default is false.
* `minify`: `[boolean]` - Set to true to minify and uglify the generated service-worker, default is false.

[__`sw-precache` options__][sw-precache-options]:
Pass any option from `sw-precache` into your configuration. Some of these will be automatically be populated if you do not specify the value and a couple others will be modified to be more compatible with webpack. Options that are populated / modified:

* `cacheId`: `[String]` - Not required but you should include this, it will give your service worker cache a unique name. Defaults to "sw-precache-webpack-plugin".
* `importScripts`: `[Array<String|Object>]`
  - When importScripts array item is a `String`:
    - Converts to object format `{ filename: '<publicPath>/my-script.js'}`
  - When importScripts array item is an `Object`:
    - Looks for `chunkName` property.
    - Looks for `filename` property.
    - **If a `chunkName` is specified, it will override the accompanied value for `filename`.**
* `replacePrefix`: `[String]` - Should only be used in conjunction with `stripPrefix`
* `staticFileGlobs`: `[Array<String>]` - Omit this to allow the plugin to cache all your bundles' emitted assets. If `mergeStaticsConfig=true`: this value will be merged with your bundles' emitted assets, otherwise this value is just passed to `sw-precache` and emitted assets won't be included.
* `stripPrefix`: `[String]` - Same as `stripPrefixMulti[stripPrefix] = ''`
* `stripPrefixMulti`: `[Object<String,String>]` - Omit this to use your webpack config's `output.path + '/': output.publicPath`. If `mergeStaticsConfig=true`, this value will be merged with your webpack's `output.path: publicPath` for stripping prefixes. Otherwise this property will be passed directly to `sw-precache` and Webpack's output path won't be replaced.

_Note that all configuration options are optional. `SWPrecacheWebpackPlugin` will by default use all your assets emitted by webpack's compiler for the `staticFileGlobs` parameter and your webpack config's `{[output.path + '/']: output.publicPath}` as the `stripPrefixMulti` parameter. This behavior is probably what you want, all your webpack assets will be cached by your generated service worker. Just don't pass any arguments when you initialize this plugin, and let this plugin handle generating your `sw-precache` configuration._

## Examples
See the [examples documentation][example-project] or the implementation in [create-react-app].

### Simplest Example
No arguments are required by default, `SWPrecacheWebpackPlugin` will use information provided by webpack to generate a service worker into your build directory that caches all your webpack assets.
```javascript
module.exports = {
  ...
  plugins: [
    new SWPrecacheWebpackPlugin(),
  ],
  ...
}
```

### Advanced Example
Here's a more elaborate example with `mergeStaticsConfig: true` and `staticFileGlobsIgnorePatterns`. `mergeStaticsConfig: true` allows you to add some additional static file globs to the emitted ServiceWorker file alongside Webpack's emitted assets. `staticFileGlobsIgnorePatterns` can be used to avoid including sourcemap file references in the generated ServiceWorker.
```javascript
plugins: [
  new SWPrecacheWebpackPlugin({
    cacheId: 'my-project-name',
    filename: 'my-project-service-worker.js',
    staticFileGlobs: [
      'src/static/img/**.*',
      'src/static/styles.css',
    ],
    stripPrefix: 'src/static/', // stripPrefixMulti is also supported
    mergeStaticsConfig: true, // if you don't set this to true, you won't see any webpack-emitted assets in your serviceworker config
    staticFileGlobsIgnorePatterns: [/\.map$/], // use this to ignore sourcemap files
  }),
]
```

### `importScripts` usage example
Accepts an array of `<String|Object>`'s. `String` entries are legacy supported. Use `filename` instead.

If `importScripts` item is object, there are 2 possible properties to set on this object:
- **filename**: Use this if you are referencing a path that "you just know" exists. You probably don't want to use this for named chunks.
- **chunkName**: Supports named entry chunks & dynamically imported named chunks.
```javascript
entry: {
  main: __dirname + '/src/index.js',
  sw: __dirname + '/src/service-worker-entry.js'
},
output: {
  publicPath: '/my/public/path',
  chunkfileName: '[name].[<hash|chunkhash>].js'
},
plugins: [
  new SWPrecacheWebpackPlugin({
    filename: 'my-project-service-worker.js',
    importSripts: [
      // * legacy supported
      // [chunkhash] is not supported for this usage
      // This is transformed to new object syntax:
      // { filename: '/my/public/path/some-known-script-path.js' }
      'some-known-script-path.js',

      // This use case is identical to above, except
      // for excluding the .[hash] part:
      { filename: 'some-known-script-path.[hash].js' },

      // When [chunkhash] is specified in filename:
      // - filename must match the format specified in output.chunkfileName
      // - If chunkName is invalid; an error will be reported
      { chunkName: 'sw' },

      // Works for named entry chunks & dynamically imported named chunks:
      // For ex, if in your code is:
      // import(/* webpackChunkName: "my-named-chunk" */ './my-async-script.js');
      { chunkName: 'my-named-chunk' },

      // All importSripts entries resolve to a string, therefore
      // the final output of the above input is:
      // [
      //   '/my/public/path/some-known-script-path.js',
      //   '/my/public/path/some-known-script-path.<compilation hash>.js',
      //   '/my/public/path/some-known-script-path.<chunkhash>.js',
      //   '/my/public/path/<id>.my-named-chunk.<chunkhash>.js'
      // ]
    ]
  }),
]
```

## Webpack Dev Server Support
Currently `SWPrecacheWebpackPlugin` will not work with `Webpack Dev Server`. If you wish to test the service worker locally, you can use simple a node server [see example project][example-project] or `python SimpleHTTPServer` from your build directory. I would suggest pointing your node server to a different port than your usual local development port and keeping the precache service worker out of your [local configuration (example)][webpack-local-config-example].

There will likely never be `webpack-dev-server` support. `sw-precache` needs physical files in order to generate the service worker. Webpack-dev-server files are in-memory. It is only possible to provide `sw-precache` with globs to find these files. It will follow the glob pattern and generate a list of file names to cache.


## Contributing
Install node dependencies:
```
  $ npm install
```

Or:
```
  $ yarn
```

Add unit tests for your new feature in `./test/plugin.spec.js`

## Testing
Tests are located in `./test`

Run tests:
```
  $ npm t
```

<!--references-->
[sw-guide]: https://github.com/goldhand/notes/blob/master/notes/service_workers.md "Introduction to service workers"
[sw-precache]: https://github.com/GoogleChrome/sw-precache "SW-Precache"
[sw-precache-options]: https://github.com/GoogleChrome/sw-precache#options-parameter "SW-Precache Options"
[sw-precache-registration-example]: https://github.com/GoogleChrome/sw-precache/blob/5699e5d049235ef0f668e8e2aa3bf2646ba3872f/demo/app/js/service-worker-registration.js
[example-project]: /examples/
[webpack]: http://webpack.github.io/
[webpack-local-config-example]: https://github.com/goldhand/cookiecutter-webpack/blob/986151474b60dc19166eba18156a1f9dbceecb98/%7B%7Bcookiecutter.repo_name%7D%7D/webpack.local.config.js "Webpack local config example"
[create-react-app]: https://github.com/facebookincubator/create-react-app/blob/e91648a9bb55230fa15a7867fd5b730d7e1a5808/packages/react-scripts/config/webpack.config.prod.js#L308

[npm-url]: https://npmjs.org/package/sw-precache-webpack-plugin
[npm-img]: https://badge.fury.io/js/sw-precache-webpack-plugin.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/sw-precache-webpack-plugin.svg?style=flat-square
[daviddm-img]: https://david-dm.org/goldhand/sw-precache-webpack-plugin.svg
[daviddm-url]: https://david-dm.org/goldhand/sw-precache-webpack-plugin
[circleci-img]: https://circleci.com/gh/goldhand/sw-precache-webpack-plugin.svg?style=svg
[circleci-url]: https://circleci.com/gh/goldhand/sw-precache-webpack-plugin
