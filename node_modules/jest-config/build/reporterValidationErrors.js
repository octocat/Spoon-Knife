'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _require =










require('jest-validate');const ValidationError = _require.ValidationError; /**
                                                                            * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                            *
                                                                            * This source code is licensed under the BSD-style license found in the
                                                                            * LICENSE file in the root directory of this source tree. An additional grant
                                                                            * of patent rights can be found in the PATENTS file in the same directory.
                                                                            * 
                                                                            */const chalk = require('chalk');var _require2 = require('jest-matcher-utils');const getType = _require2.getType;var _require3 = require('./utils');const DOCUMENTATION_NOTE = _require3.DOCUMENTATION_NOTE,BULLET = _require3.BULLET;const validReporterTypes = ['array', 'string'];const ERROR = `${BULLET}Reporter Validation Error`;

/**
                                                                                                                                                                                                                                                                                                                                                                                                                      * Reporter Validation Error is thrown if the given arguments
                                                                                                                                                                                                                                                                                                                                                                                                                      * within the reporter are not valid.
                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                      * This is a highly specific reporter error and in the future will be
                                                                                                                                                                                                                                                                                                                                                                                                                      * merged with jest-validate. Till then, we can make use of it. It works
                                                                                                                                                                                                                                                                                                                                                                                                                      * and that's what counts most at this time.
                                                                                                                                                                                                                                                                                                                                                                                                                      */
function createReporterError(
reporterIndex,
reporterValue)
{
  const errorMessage =
  `  Reporter at index ${reporterIndex} must be of type:\n` +
  `    ${chalk.bold.green(validReporterTypes.join(' or '))}\n` +
  `  but instead received:\n` +
  `    ${chalk.bold.red(getType(reporterValue))}`;

  return new ValidationError(ERROR, errorMessage, DOCUMENTATION_NOTE);
}

function createArrayReporterError(
arrayReporter,
reporterIndex,
valueIndex,
value,
expectedType,
valueName)
{
  const errorMessage =
  `  Unexpected value for ${valueName} ` +
  `at index ${valueIndex} of reporter at index ${reporterIndex}\n` +
  '  Expected:\n' +
  `    ${chalk.bold.red(expectedType)}\n` +
  '  Got:\n' +
  `    ${chalk.bold.green(getType(value))}\n` +
  `  Reporter configuration:\n` +
  `    ${chalk.bold.green(JSON.stringify(arrayReporter, null, 2).
  split('\n').
  join('\n    '))}`;

  return new ValidationError(ERROR, errorMessage, DOCUMENTATION_NOTE);
}

function validateReporters(
reporterConfig)
{
  return reporterConfig.every((reporter, index) => {
    if (Array.isArray(reporter)) {
      validateArrayReporter(reporter, index);
    } else if (typeof reporter !== 'string') {
      throw createReporterError(index, reporter);
    }

    return true;
  });
}

function validateArrayReporter(
arrayReporter,
reporterIndex)
{var _arrayReporter = _slicedToArray(
  arrayReporter, 2);const path = _arrayReporter[0],options = _arrayReporter[1];
  if (typeof path !== 'string') {
    throw createArrayReporterError(
    arrayReporter,
    reporterIndex,
    0,
    path,
    'string',
    'Path');

  } else if (typeof options !== 'object') {
    throw createArrayReporterError(
    arrayReporter,
    reporterIndex,
    1,
    options,
    'object',
    'Reporter Configuration');

  }
}

module.exports = {
  createArrayReporterError,
  createReporterError,
  validateReporters };