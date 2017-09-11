'use strict';











const printImmutable = require('./lib/printImmutable'); /**
                                                         * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                         *
                                                         * This source code is licensed under the BSD-style license found in the
                                                         * LICENSE file in the root directory of this source tree. An additional grant
                                                         * of patent rights can be found in the PATENTS file in the same directory.
                                                         *
                                                         * 
                                                         */const IS_STACK = '@@__IMMUTABLE_STACK__@@';const test = maybeStack => !!(maybeStack && maybeStack[IS_STACK]);const print = (val, print, indent,
opts,
colors) =>
printImmutable(val, print, indent, opts, colors, 'Stack', false);

module.exports = { print, test };