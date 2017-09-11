'use strict';var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _require =











require('jest-regex-util'),escapeStrForRegex = _require.escapeStrForRegex; /**
                                                                            * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                                                            *
                                                                            * This source code is licensed under the BSD-style license found in the
                                                                            * LICENSE file in the root directory of this source tree. An additional grant
                                                                            * of patent rights can be found in the PATENTS file in the same directory.
                                                                            *
                                                                            * 
                                                                            */var _require2 = require('jest-message-util'),formatStackTrace = _require2.formatStackTrace,separateMessageFromStack = _require2.separateMessageFromStack;var _require3 =




require('jest-matcher-utils'),RECEIVED_BG = _require3.RECEIVED_BG,RECEIVED_COLOR = _require3.RECEIVED_COLOR,getType = _require3.getType,highlightTrailingWhitespace = _require3.highlightTrailingWhitespace,matcherHint = _require3.matcherHint,printExpected = _require3.printExpected,printWithType = _require3.printWithType;var _require4 =
require('./jasmine-utils'),equals = _require4.equals;

var createMatcher = function createMatcher(matcherName) {return function (
  actual,
  expected)
  {
    var value = expected;
    var error = void 0;

    if (typeof actual !== 'function') {
      throw new Error(
      matcherHint(matcherName, 'function', getType(value)) +
      '\n\n' +
      'Received value must be a function, but instead ' + ('"' +
      getType(actual) + '" was found'));

    }

    try {
      actual();
    } catch (e) {
      error = e;
    }

    if (typeof expected === 'string') {
      expected = new RegExp(escapeStrForRegex(expected));
    }

    if (typeof expected === 'function') {
      return toThrowMatchingError(matcherName, error, expected);
    } else if (expected instanceof RegExp) {
      return toThrowMatchingStringOrRegexp(matcherName, error, expected, value);
    } else if (expected && (typeof expected === 'undefined' ? 'undefined' : (0, _typeof3.default)(expected)) === 'object') {
      return toThrowMatchingErrorInstance(matcherName, error, expected);
    } else if (expected === undefined) {
      var pass = error !== undefined;
      return {
        message: pass ?
        function () {return (
            matcherHint('.not' + matcherName, 'function', '') +
            '\n\n' +
            'Expected the function not to throw an error.\n' +
            printActualErrorMessage(error));} :
        function () {return (
            matcherHint(matcherName, 'function', getType(value)) +
            '\n\n' +
            'Expected the function to throw an error.\n' +
            printActualErrorMessage(error));},
        pass: pass };

    } else {
      throw new Error(
      matcherHint('.not' + matcherName, 'function', getType(value)) +
      '\n\n' +
      'Unexpected argument passed.\nExpected: ' + (
      printExpected('string') + ', ' + printExpected('Error (type)') + ' or ' + printExpected('regexp') + '.\n') +
      printWithType('Got', String(expected), printExpected));

    }
  };};

var matchers = {
  toThrow: createMatcher('.toThrow'),
  toThrowError: createMatcher('.toThrowError') };


var toThrowMatchingStringOrRegexp = function toThrowMatchingStringOrRegexp(
name,
error,
pattern,
value)
{
  if (error && !error.message && !error.name) {
    error = new Error(error);
  }

  var pass = !!(error && error.message.match(pattern));
  var message = pass ?
  function () {return (
      matcherHint('.not' + name, 'function', getType(value)) +
      '\n\n' + 'Expected the function not to throw an error matching:\n' + ('  ' +

      printExpected(value) + '\n') +
      printActualErrorMessage(error));} :
  function () {return (
      matcherHint(name, 'function', getType(value)) +
      '\n\n' + 'Expected the function to throw an error matching:\n' + ('  ' +

      printExpected(value) + '\n') +
      printActualErrorMessage(error));};

  return { message: message, pass: pass };
};

var toThrowMatchingErrorInstance = function toThrowMatchingErrorInstance(
name,
error,
expectedError)
{
  if (error && !error.message && !error.name) {
    error = new Error(error);
  }

  var pass = equals(error, expectedError);
  var message = pass ?
  function () {return (
      matcherHint('.not' + name, 'function', 'error') +
      '\n\n' + 'Expected the function not to throw an error matching:\n' + ('  ' +

      printExpected(expectedError) + '\n') +
      printActualErrorMessage(error));} :
  function () {return (
      matcherHint(name, 'function', 'error') +
      '\n\n' + 'Expected the function to throw an error matching:\n' + ('  ' +

      printExpected(expectedError) + '\n') +
      printActualErrorMessage(error));};

  return { message: message, pass: pass };
};

var toThrowMatchingError = function toThrowMatchingError(
name,
error,
ErrorClass)
{
  var pass = !!(error && error instanceof ErrorClass);
  var message = pass ?
  function () {return (
      matcherHint('.not' + name, 'function', 'type') +
      '\n\n' + 'Expected the function not to throw an error of type:\n' + ('  ' +

      printExpected(ErrorClass.name) + '\n') +
      printActualErrorMessage(error));} :
  function () {return (
      matcherHint(name, 'function', 'type') +
      '\n\n' + 'Expected the function to throw an error of type:\n' + ('  ' +

      printExpected(ErrorClass.name) + '\n') +
      printActualErrorMessage(error));};

  return { message: message, pass: pass };
};

var printActualErrorMessage = function printActualErrorMessage(error) {
  if (error) {var _separateMessageFromS =
    separateMessageFromStack(error.stack),message = _separateMessageFromS.message,stack = _separateMessageFromS.stack;
    return (
      'Instead, it threw:\n' +
      RECEIVED_COLOR(
      '  ' +
      highlightTrailingWhitespace(message, RECEIVED_BG) +
      formatStackTrace(
      stack,
      {
        rootDir: process.cwd(),
        testMatch: [] },

      {
        noStackTrace: false })));




  }

  return 'But it didn\'t throw anything.';
};

module.exports = matchers;