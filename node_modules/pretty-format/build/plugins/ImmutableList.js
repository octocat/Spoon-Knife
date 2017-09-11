'use strict';











const printImmutable = require('./lib/printImmutable'); /**
                                                         * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                         *
                                                         * This source code is licensed under the BSD-style license found in the
                                                         * LICENSE file in the root directory of this source tree. An additional grant
                                                         * of patent rights can be found in the PATENTS file in the same directory.
                                                         *
                                                         * 
                                                         */const IS_LIST = '@@__IMMUTABLE_LIST__@@';const test = maybeList => !!(maybeList && maybeList[IS_LIST]);const print = (val, print, indent,
opts,
colors) =>
printImmutable(val, print, indent, opts, colors, 'List', false);

module.exports = { print, test };