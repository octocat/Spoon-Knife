'use strict';











const chalk = require('chalk'); /**
                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                 *
                                 * This source code is licensed under the BSD-style license found in the
                                 * LICENSE file in the root directory of this source tree. An additional grant
                                 * of patent rights can be found in the PATENTS file in the same directory.
                                 *
                                 * 
                                 */var _require = require('jest-matcher-utils');const getType = _require.getType;var _require2 = require('./utils');const format = _require2.format,ValidationError = _require2.ValidationError,ERROR = _require2.ERROR;const errorMessage = (option, received, defaultValue, options) =>
{
  const message = `  Option ${chalk.bold(`"${option}"`)} must be of type:
    ${chalk.bold.green(getType(defaultValue))}
  but instead received:
    ${chalk.bold.red(getType(received))}

  Example:
  {
    ${chalk.bold(`"${option}"`)}: ${chalk.bold(format(defaultValue))}
  }`;

  const comment = options.comment;
  const name = options.title && options.title.error || ERROR;

  throw new ValidationError(name, message, comment);
};

module.exports = {
  ValidationError,
  errorMessage };