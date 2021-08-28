/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env node */
'use strict';

var crypto = require('crypto');
var defaults = require('lodash.defaults');
var externalFunctions = require('./functions.js');
var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');
var path = require('path');
var prettyBytes = require('pretty-bytes');
var template = require('lodash.template');
var util = require('util');
require('es6-promise').polyfill();

// This should only change if there are breaking changes in the cache format used by the SW.
var VERSION = 'v3';

function absolutePath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

function getFileAndSizeAndHashForFile(file) {
  var stat = fs.statSync(file);

  if (stat.isFile()) {
    var buffer = fs.readFileSync(file);
    return {
      file: file,
      size: stat.size,
      hash: getHash(buffer)
    };
  }

  return null;
}

function getFilesAndSizesAndHashesForGlobPattern(globPattern, excludeFilePath) {
  return glob.sync(globPattern.replace(path.sep, '/')).map(function(file) {
    // Return null if we want to exclude this file, and it will be excluded in
    // the subsequent filter().
    return excludeFilePath === absolutePath(file) ?
      null :
      getFileAndSizeAndHashForFile(file);
  }).filter(function(fileAndSizeAndHash) {
    return fileAndSizeAndHash !== null;
  });
}

function getHash(data) {
  var md5 = crypto.createHash('md5');
  md5.update(data);

  return md5.digest('hex');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateRuntimeCaching(runtimeCaching) {
  return runtimeCaching.reduce(function(prev, curr) {
    var line;
    if (curr.default) {
      line = util.format('\ntoolbox.router.default = toolbox.%s;',
        curr.default);
    } else {
      var urlPattern = curr.urlPattern;
      if (typeof urlPattern === 'string') {
        urlPattern = JSON.stringify(urlPattern);
      }

      if (!(urlPattern instanceof RegExp ||
            typeof urlPattern === 'string')) {
        throw new Error(
          'runtimeCaching.urlPattern must be a string or RegExp');
      }

      line = util.format('\ntoolbox.router.%s(%s, %s, %s);',
        // Default to setting up a 'get' handler.
        curr.method || 'get',
        // urlPattern might be a String or a RegExp. sw-toolbox supports both.
        urlPattern,
        // If curr.handler is a string, then assume it's the name of one
        // of the built-in sw-toolbox strategies.
        // E.g. 'networkFirst' -> toolbox.networkFirst
        // If curr.handler is something else (like a function), then just
        // include its body inline.
        (typeof curr.handler === 'string' ? 'toolbox.' : '') + curr.handler,
        // Default to no options.
        stringifyToolboxOptions(curr.options));
    }

    return prev + line;
  }, '');
}

function stringifyToolboxOptions(options) {
  options = options || {};
  var str = JSON.stringify(options);
  if (options.origin instanceof RegExp) {
    str = str.replace(/("origin":)\{\}/, '$1' + options.origin);
  }
  if (options.successResponses instanceof RegExp) {
    str = str.replace(/("successResponses":)\{\}/,
      '$1' + options.successResponses);
  }
  return str;
}

function generate(params, callback) {
  return new Promise(function(resolve, reject) {
    params = defaults(params || {}, {
      cacheId: '',
      clientsClaim: true,
      directoryIndex: 'index.html',
      dontCacheBustUrlsMatching: null,
      dynamicUrlToDependencies: {},
      handleFetch: true,
      ignoreUrlParametersMatching: [/^utm_/],
      importScripts: [],
      logger: console.log,
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2MB
      navigateFallback: '',
      navigateFallbackWhitelist: [],
      replacePrefix: '',
      skipWaiting: true,
      staticFileGlobs: [],
      stripPrefix: '',
      stripPrefixMulti: {},
      templateFilePath: path.join(
        path.dirname(fs.realpathSync(__filename)), '..', 'service-worker.tmpl'),
      verbose: false
    });

    if (!Array.isArray(params.ignoreUrlParametersMatching)) {
      params.ignoreUrlParametersMatching = [params.ignoreUrlParametersMatching];
    }

    var relativeUrlToHash = {};
    var cumulativeSize = 0;
    params.stripPrefixMulti[params.stripPrefix] = params.replacePrefix;

    params.staticFileGlobs.forEach(function(globPattern) {
      var filesAndSizesAndHashes = getFilesAndSizesAndHashesForGlobPattern(
        globPattern, params.outputFilePath);

      // The files returned from glob are sorted by default, so we don't need to sort here.
      filesAndSizesAndHashes.forEach(function(fileAndSizeAndHash) {
        if (fileAndSizeAndHash.size <= params.maximumFileSizeToCacheInBytes) {
          // Strip the prefix to turn this into a relative URL.
          var relativeUrl = fileAndSizeAndHash.file
            .replace(
              new RegExp('^(' + Object.keys(params.stripPrefixMulti)
                  .map(escapeRegExp).join('|') + ')'),
              function(match) {
                return params.stripPrefixMulti[match];
              })
            .replace(path.sep, '/');
          relativeUrlToHash[relativeUrl] = fileAndSizeAndHash.hash;

          if (params.verbose) {
            params.logger(util.format('Caching static resource "%s" (%s)',
              fileAndSizeAndHash.file,
              prettyBytes(fileAndSizeAndHash.size)));
          }

          cumulativeSize += fileAndSizeAndHash.size;
        } else {
          params.logger(
            util.format('Skipping static resource "%s" (%s) - max size is %s',
            fileAndSizeAndHash.file, prettyBytes(fileAndSizeAndHash.size),
            prettyBytes(params.maximumFileSizeToCacheInBytes)));
        }
      });
    });

    Object.keys(params.dynamicUrlToDependencies).forEach(function(dynamicUrl) {
      var dependency = params.dynamicUrlToDependencies[dynamicUrl];
      var isString = typeof dependency === 'string';
      var isBuffer = Buffer.isBuffer(dependency);

      if (!Array.isArray(dependency) && !isString && !isBuffer) {
        throw Error(util.format(
          'The value for the dynamicUrlToDependencies.%s ' +
          'option must be an Array, a Buffer, or a String.',
          dynamicUrl));
      }

      if (isString || isBuffer) {
        cumulativeSize += dependency.length;
        relativeUrlToHash[dynamicUrl] = getHash(dependency);
      } else {
        var filesAndSizesAndHashes = dependency
          .sort()
          .map(function(file) {
            try {
              return getFileAndSizeAndHashForFile(file);
            } catch (e) {
              // Provide some additional information about the failure if the file is missing.
              if (e.code === 'ENOENT') {
                params.logger(util.format(
                  '%s was listed as a dependency for dynamic URL %s, but ' +
                  'the file does not exist. Either remove the entry as a ' +
                  'dependency, or correct the path to the file.',
                  file, dynamicUrl
                ));
              }
              // Re-throw the exception unconditionally, since this should be treated as fatal.
              throw e;
            }
          });
        var concatenatedHashes = '';

        filesAndSizesAndHashes.forEach(function(fileAndSizeAndHash) {
          // Let's assume that the response size of a server-generated page is roughly equal to the
          // total size of all its components.
          cumulativeSize += fileAndSizeAndHash.size;
          concatenatedHashes += fileAndSizeAndHash.hash;
        });

        relativeUrlToHash[dynamicUrl] = getHash(concatenatedHashes);
      }

      if (params.verbose) {
        if (isString) {
          params.logger(util.format(
            'Caching dynamic URL "%s" with dependency on user-supplied string',
            dynamicUrl));
        } else if (isBuffer) {
          params.logger(util.format(
            'Caching dynamic URL "%s" with dependency on user-supplied buffer',
            dynamicUrl));
        } else {
          params.logger(util.format(
            'Caching dynamic URL "%s" with dependencies on %j',
            dynamicUrl, dependency));
        }
      }
    });

    var runtimeCaching;
    var swToolboxCode;
    if (params.runtimeCaching) {
      runtimeCaching = generateRuntimeCaching(params.runtimeCaching);
      var pathToSWToolbox = require.resolve('sw-toolbox/sw-toolbox.js');
      swToolboxCode = fs.readFileSync(pathToSWToolbox, 'utf8')
        .replace('//# sourceMappingURL=sw-toolbox.js.map', '');
    }

    // It's very important that running this operation multiple times with the same input files
    // produces identical output, since we need the generated service-worker.js file to change if
    // the input files changes. The service worker update algorithm,
    // https://w3c.github.io/ServiceWorker/#update-algorithm, relies on detecting even a single
    // byte change in service-worker.js to trigger an update. Because of this, we write out the
    // cache options as a series of sorted, nested arrays rather than as objects whose serialized
    // key ordering might vary.
    var relativeUrls = Object.keys(relativeUrlToHash);
    var precacheConfig = relativeUrls.sort().map(function(relativeUrl) {
      return [relativeUrl, relativeUrlToHash[relativeUrl]];
    });

    params.logger(util.format(
      'Total precache size is about %s for %d resources.',
      prettyBytes(cumulativeSize), relativeUrls.length));

    fs.readFile(params.templateFilePath, 'utf8', function(error, data) {
      if (error) {
        if (callback) {
          callback(error);
        }

        return reject(error);
      }

      var populatedTemplate = template(data)({
        cacheId: params.cacheId,
        clientsClaim: params.clientsClaim,
        // Ensure that anything false is translated into '', since this will be treated as a string.
        directoryIndex: params.directoryIndex || '',
        dontCacheBustUrlsMatching: params.dontCacheBustUrlsMatching || false,
        externalFunctions: externalFunctions,
        handleFetch: params.handleFetch,
        ignoreUrlParametersMatching: params.ignoreUrlParametersMatching,
        importScripts: params.importScripts ?
          params.importScripts.map(JSON.stringify).join(',') : null,
        // Ensure that anything false is translated into '', since this will be treated as a string.
        navigateFallback: params.navigateFallback || '',
        navigateFallbackWhitelist:
          JSON.stringify(params.navigateFallbackWhitelist.map(function(regex) {
            return regex.source;
          })),
        precacheConfig: JSON.stringify(precacheConfig),
        runtimeCaching: runtimeCaching,
        skipWaiting: params.skipWaiting,
        swToolboxCode: swToolboxCode,
        version: VERSION
      });

      if (callback) {
        callback(null, populatedTemplate);
      }

      resolve(populatedTemplate);
    });
  });
}

function write(filePath, params, callback) {
  return new Promise(function(resolve, reject) {
    function finish(error, value) {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }

      if (callback) {
        callback(error, value);
      }
    }

    mkdirp.sync(path.dirname(filePath));

    // Keep track of where we're outputting the file to ensure that we don't
    // pick up a previously written version in our new list of files.
    // See https://github.com/GoogleChrome/sw-precache/issues/101
    params.outputFilePath = absolutePath(filePath);

    generate(params).then(function(serviceWorkerFileContents) {
      fs.writeFile(filePath, serviceWorkerFileContents, finish);
    }, finish);
  });
}

module.exports = {
  generate: generate,
  write: write
};

if (process.env.NODE_ENV === 'swprecache-test') {
  module.exports.generateRuntimeCaching = generateRuntimeCaching;
}
