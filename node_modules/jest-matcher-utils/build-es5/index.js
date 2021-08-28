'use strict';var _set = require('babel-runtime/core-js/set');var _set2 = _interopRequireDefault(_set);var _map = require('babel-runtime/core-js/map');var _map2 = _interopRequireDefault(_map);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                                                                                                                                                                                                                     * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                     * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                     * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                     * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                     * 
                                                                                                                                                                                                                                                                                                                                                                                                     */

var chalk = require('chalk');
var prettyFormat = require('pretty-format');var _require$plugins =





require('pretty-format').plugins,AsymmetricMatcher = _require$plugins.AsymmetricMatcher,ReactElement = _require$plugins.ReactElement,HTMLElement = _require$plugins.HTMLElement,Immutable = _require$plugins.Immutable;

var PLUGINS = [AsymmetricMatcher, ReactElement, HTMLElement].concat(
Immutable);
















var EXPECTED_COLOR = chalk.green;
var EXPECTED_BG = chalk.bgGreen;
var RECEIVED_COLOR = chalk.red;
var RECEIVED_BG = chalk.bgRed;

var NUMBERS = [
'zero',
'one',
'two',
'three',
'four',
'five',
'six',
'seven',
'eight',
'nine',
'ten',
'eleven',
'twelve',
'thirteen'];


// get the type of a value with handling the edge cases like `typeof []`
// and `typeof null`
var getType = function getType(value) {
  if (typeof value === 'undefined') {
    return 'undefined';
  } else if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else if (typeof value === 'function') {
    return 'function';
  } else if (typeof value === 'number') {
    return 'number';
  } else if (typeof value === 'string') {
    return 'string';
  } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
    if (value.constructor === RegExp) {
      return 'regexp';
    } else if (value.constructor === _map2.default) {
      return 'map';
    } else if (value.constructor === _set2.default) {
      return 'set';
    }
    return 'object';
    // $FlowFixMe https://github.com/facebook/flow/issues/1015
  } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'symbol') {
    return 'symbol';
  }

  throw new Error('value of unknown type: ' + value);
};

var stringify = function stringify(object) {var maxDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var MAX_LENGTH = 10000;
  var result = void 0;

  try {
    result = prettyFormat(object, {
      maxDepth: maxDepth,
      min: true,
      plugins: PLUGINS });

  } catch (e) {
    result = prettyFormat(object, {
      callToJSON: false,
      maxDepth: maxDepth,
      min: true,
      plugins: PLUGINS });

  }

  return result.length >= MAX_LENGTH && maxDepth > 1 ?
  stringify(object, Math.floor(maxDepth / 2)) :
  result;
};

var highlightTrailingWhitespace = function highlightTrailingWhitespace(text, bgColor) {return (
    text.replace(/\s+$/gm, bgColor('$&')));};

var printReceived = function printReceived(object) {return (
    highlightTrailingWhitespace(RECEIVED_COLOR(stringify(object)), RECEIVED_BG));};
var printExpected = function printExpected(value) {return (
    highlightTrailingWhitespace(EXPECTED_COLOR(stringify(value)), EXPECTED_BG));};

var printWithType = function printWithType(
name,
received,
print)
{
  var type = getType(received);
  return (
    name +
    ':' + (
    type !== 'null' && type !== 'undefined' ? '\n  ' + type + ': ' : ' ') +
    print(received));

};

var ensureNoExpected = function ensureNoExpected(expected, matcherName) {
  matcherName || (matcherName = 'This');
  if (typeof expected !== 'undefined') {
    throw new Error(
    matcherHint('[.not]' + matcherName, undefined, '') +
    '\n\n' +
    'Matcher does not accept any arguments.\n' +
    printWithType('Got', expected, printExpected));

  }
};

var ensureActualIsNumber = function ensureActualIsNumber(actual, matcherName) {
  matcherName || (matcherName = 'This matcher');
  if (typeof actual !== 'number') {
    throw new Error(
    matcherHint('[.not]' + matcherName) +
    '\n\n' + 'Received value must be a number.\n' +

    printWithType('Received', actual, printReceived));

  }
};

var ensureExpectedIsNumber = function ensureExpectedIsNumber(expected, matcherName) {
  matcherName || (matcherName = 'This matcher');
  if (typeof expected !== 'number') {
    throw new Error(
    matcherHint('[.not]' + matcherName) +
    '\n\n' + 'Expected value must be a number.\n' +

    printWithType('Got', expected, printExpected));

  }
};

var ensureNumbers = function ensureNumbers(actual, expected, matcherName) {
  ensureActualIsNumber(actual, matcherName);
  ensureExpectedIsNumber(expected, matcherName);
};

var pluralize = function pluralize(word, count) {return (
    (NUMBERS[count] || count) + ' ' + word + (count === 1 ? '' : 's'));};

var matcherHint = function matcherHint(
matcherName)






{var received = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'received';var expected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'expected';var options = arguments[3];
  var secondArgument = options && options.secondArgument;
  var isDirectExpectCall = options && options.isDirectExpectCall;
  return (
    chalk.dim('expect' + (isDirectExpectCall ? '' : '(')) +
    RECEIVED_COLOR(received) +
    chalk.dim((isDirectExpectCall ? '' : ')') + matcherName + '(') +
    EXPECTED_COLOR(expected) + (
    secondArgument ? ', ' + EXPECTED_COLOR(secondArgument) : '') +
    chalk.dim(')'));

};

module.exports = {
  EXPECTED_BG: EXPECTED_BG,
  EXPECTED_COLOR: EXPECTED_COLOR,
  RECEIVED_BG: RECEIVED_BG,
  RECEIVED_COLOR: RECEIVED_COLOR,
  ensureActualIsNumber: ensureActualIsNumber,
  ensureExpectedIsNumber: ensureExpectedIsNumber,
  ensureNoExpected: ensureNoExpected,
  ensureNumbers: ensureNumbers,
  getType: getType,
  highlightTrailingWhitespace: highlightTrailingWhitespace,
  matcherHint: matcherHint,
  pluralize: pluralize,
  printExpected: printExpected,
  printReceived: printReceived,
  printWithType: printWithType,
  stringify: stringify };