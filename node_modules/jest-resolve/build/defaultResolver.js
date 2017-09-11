'use strict';











const resolve = require('resolve'); /**
                                     * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                     *
                                     * This source code is licensed under the BSD-style license found in the
                                     * LICENSE file in the root directory of this source tree. An additional grant
                                     * of patent rights can be found in the PATENTS file in the same directory.
                                     *
                                     * 
                                     */const browserResolve = require('browser-resolve');


function defaultResolver(path, options) {
  const resv = options.browser ? browserResolve : resolve;

  return resv.sync(path, {
    basedir: options.basedir,
    extensions: options.extensions,
    moduleDirectory: options.moduleDirectory,
    paths: options.paths });

}

module.exports = defaultResolver;