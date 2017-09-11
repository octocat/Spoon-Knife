'use strict';











var config = {
  comment: '  A comment',
  condition: function condition(option, validOption) {return true;},
  deprecate: function deprecate(config, option, deprecatedOptions, options) {return false;},
  deprecatedConfig: {
    key: function key(config) {} },

  error: function error(option, received, defaultValue, options) {},
  exampleConfig: { key: 'value', test: 'case' },
  title: {
    deprecation: 'Deprecation Warning',
    error: 'Validation Error',
    warning: 'Validation Warning' },

  unknown: function unknown(config, option, options) {} }; /**
                                                            * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                            *
                                                            * This source code is licensed under the BSD-style license found in the
                                                            * LICENSE file in the root directory of this source tree. An additional grant
                                                            * of patent rights can be found in the PATENTS file in the same directory.
                                                            *
                                                            * 
                                                            */module.exports = config;