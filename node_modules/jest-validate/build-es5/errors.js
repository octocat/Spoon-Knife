'use strict';











var chalk = require('chalk'); /**
                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                               *
                               * This source code is licensed under the BSD-style license found in the
                               * LICENSE file in the root directory of this source tree. An additional grant
                               * of patent rights can be found in the PATENTS file in the same directory.
                               *
                               * 
                               */var _require = require('jest-matcher-utils'),getType = _require.getType;var _require2 = require('./utils'),format = _require2.format,ValidationError = _require2.ValidationError,ERROR = _require2.ERROR;var errorMessage = function errorMessage(option, received, defaultValue, options)
{
  var message = '  Option ' + chalk.bold('"' + option + '"') + ' must be of type:\n    ' +
  chalk.bold.green(getType(defaultValue)) + '\n  but instead received:\n    ' +

  chalk.bold.red(getType(received)) + '\n\n  Example:\n  {\n    ' +



  chalk.bold('"' + option + '"') + ': ' + chalk.bold(format(defaultValue)) + '\n  }';


  var comment = options.comment;
  var name = options.title && options.title.error || ERROR;

  throw new ValidationError(name, message, comment);
};

module.exports = {
  ValidationError: ValidationError,
  errorMessage: errorMessage };