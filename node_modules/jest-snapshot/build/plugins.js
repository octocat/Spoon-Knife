'use strict';var _require$plugins =
















require('pretty-format').plugins;const HTMLElement = _require$plugins.HTMLElement,Immutable = _require$plugins.Immutable,ReactElement = _require$plugins.ReactElement,ReactTestComponent = _require$plugins.ReactTestComponent; /**
                                                                                                                                                                                                                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                 * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                 * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                 * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                 * 
                                                                                                                                                                                                                                 */let PLUGINS = [HTMLElement, ReactElement, ReactTestComponent].concat(Immutable); // Prepend to list so the last added is the first tested.
exports.addSerializer = plugin => {PLUGINS = [plugin].concat(PLUGINS);};exports.getSerializers = () => PLUGINS;