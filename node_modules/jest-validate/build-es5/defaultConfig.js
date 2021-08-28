'use strict';var _require =











require('./deprecated'),deprecationWarning = _require.deprecationWarning; /**
                                                                           * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                           *
                                                                           * This source code is licensed under the BSD-style license found in the
                                                                           * LICENSE file in the root directory of this source tree. An additional grant
                                                                           * of patent rights can be found in the PATENTS file in the same directory.
                                                                           *
                                                                           * 
                                                                           */var _require2 = require('./warnings'),unknownOptionWarning = _require2.unknownOptionWarning;var _require3 = require('./errors'),errorMessage = _require3.errorMessage;var exampleConfig = require('./exampleConfig');var validationCondition = require('./condition');var _require4 = require('./utils'),ERROR = _require4.ERROR,DEPRECATION = _require4.DEPRECATION,WARNING = _require4.WARNING;module.exports = { comment: '',
  condition: validationCondition,
  deprecate: deprecationWarning,
  deprecatedConfig: {},
  error: errorMessage,
  exampleConfig: exampleConfig,
  title: {
    deprecation: DEPRECATION,
    error: ERROR,
    warning: WARNING },

  unknown: unknownOptionWarning };