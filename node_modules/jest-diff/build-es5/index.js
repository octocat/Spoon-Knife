'use strict';var _set = require('babel-runtime/core-js/set');var _set2 = _interopRequireDefault(_set);var _from = require('babel-runtime/core-js/array/from');var _from2 = _interopRequireDefault(_from);var _map = require('babel-runtime/core-js/map');var _map2 = _interopRequireDefault(_map);var _for = require('babel-runtime/core-js/symbol/for');var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _require$plugins =

















require('pretty-format').plugins,ReactElement = _require$plugins.ReactElement,ReactTestComponent = _require$plugins.ReactTestComponent,AsymmetricMatcher = _require$plugins.AsymmetricMatcher,HTMLElement = _require$plugins.HTMLElement,Immutable = _require$plugins.Immutable; /**
                                                                                                                                                                                                                                                                                  * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                                                  * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                  * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                  * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                  *
                                                                                                                                                                                                                                                                                  * 
                                                                                                                                                                                                                                                                                  */var chalk = require('chalk');var _require = require('jest-matcher-utils'),getType = _require.getType;var prettyFormat = require('pretty-format');var diffStrings = require('./diffStrings');var _require2 = require('./constants'),NO_DIFF_MESSAGE = _require2.NO_DIFF_MESSAGE,SIMILAR_MESSAGE = _require2.SIMILAR_MESSAGE;
var PLUGINS = [
ReactTestComponent,
ReactElement,
AsymmetricMatcher,
HTMLElement].
concat(Immutable);
var FORMAT_OPTIONS = {
  plugins: PLUGINS };

var FALLBACK_FORMAT_OPTIONS = {
  callToJSON: false,
  maxDepth: 10,
  plugins: PLUGINS };


// Generate a string that will highlight the difference between two values
// with green and red. (similar to how github does code diffing)
function diff(a, b, options) {
  if (a === b) {
    return NO_DIFF_MESSAGE;
  }

  var aType = getType(a);
  var expectedType = aType;
  var omitDifference = false;
  if (aType === 'object' && typeof a.asymmetricMatch === 'function') {
    if (a.$$typeof !== (0, _for2.default)('jest.asymmetricMatcher')) {
      // Do not know expected type of user-defined asymmetric matcher.
      return null;
    }
    if (typeof a.getExpectedType !== 'function') {
      // For example, expect.anything() matches either null or undefined
      return null;
    }
    expectedType = a.getExpectedType();
    // Primitive types boolean and number omit difference below.
    // For example, omit difference for expect.stringMatching(regexp)
    omitDifference = expectedType === 'string';
  }

  if (expectedType !== getType(b)) {
    return (
      '  Comparing two different types of values.' + (' Expected ' +
      chalk.green(expectedType) + ' but ') + ('received ' +
      chalk.red(getType(b)) + '.'));

  }

  if (omitDifference) {
    return null;
  }

  switch (aType) {
    case 'string':
      var multiline = a.match(/[\r\n]/) !== -1 && b.indexOf('\n') !== -1;
      if (multiline) {
        return diffStrings(String(a), String(b), options);
      }
      return null;
    case 'number':
    case 'boolean':
      return null;
    case 'map':
      return compareObjects(sortMap(a), sortMap(b), options);
    case 'set':
      return compareObjects(sortSet(a), sortSet(b), options);
    default:
      return compareObjects(a, b, options);}

}

function sortMap(map) {
  return new _map2.default((0, _from2.default)(map.entries()).sort());
}

function sortSet(set) {
  return new _set2.default((0, _from2.default)(set.values()).sort());
}

function compareObjects(a, b, options) {
  var diffMessage = void 0;
  var hasThrown = false;

  try {
    diffMessage = diffStrings(
    prettyFormat(a, FORMAT_OPTIONS),
    prettyFormat(b, FORMAT_OPTIONS),
    options);

  } catch (e) {
    hasThrown = true;
  }

  // If the comparison yields no results, compare again but this time
  // without calling `toJSON`. It's also possible that toJSON might throw.
  if (!diffMessage || diffMessage === NO_DIFF_MESSAGE) {
    diffMessage = diffStrings(
    prettyFormat(a, FALLBACK_FORMAT_OPTIONS),
    prettyFormat(b, FALLBACK_FORMAT_OPTIONS),
    options);

    if (diffMessage !== NO_DIFF_MESSAGE && !hasThrown) {
      diffMessage = SIMILAR_MESSAGE + '\n\n' + diffMessage;
    }
  }

  return diffMessage;
}

module.exports = diff;