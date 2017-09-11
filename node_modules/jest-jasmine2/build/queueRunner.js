'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */

const once = require('once');
const pMap = require('p-map');
const pTimeout = require('./p-timeout');















function queueRunner(options) {
  const mapper = (_ref) => {let fn = _ref.fn,timeout = _ref.timeout;
    const promise = new Promise(resolve => {
      const next = once(resolve);
      next.fail = function () {
        options.fail.apply(null, arguments);
        resolve();
      };
      try {
        fn.call(options.userContext, next);
      } catch (e) {
        options.onException(e);
        resolve();
      }
    });
    if (!timeout) {
      return promise;
    }
    return pTimeout(
    promise,
    timeout(),
    options.clearTimeout,
    options.setTimeout,
    () => {
      const error = new Error(
      'Timeout - Async callback was not invoked within timeout specified ' +
      'by jasmine.DEFAULT_TIMEOUT_INTERVAL.');

      options.onException(error);
    });

  };
  return pMap(options.queueableFns, mapper, { concurrency: 1 });
}

module.exports = queueRunner;