'use strict';













const Runtime = require('jest-runtime'); /**
                                          * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                          *
                                          * This source code is licensed under the BSD-style license found in the
                                          * LICENSE file in the root directory of this source tree. An additional grant
                                          * of patent rights can be found in the PATENTS file in the same directory.
                                          *
                                          * 
                                          */module.exports = (config, _ref) => {let hasteFS = _ref.hasteFS,moduleMap = _ref.moduleMap;return { config, hasteFS, moduleMap,
    resolver: Runtime.createResolver(config, moduleMap) };};