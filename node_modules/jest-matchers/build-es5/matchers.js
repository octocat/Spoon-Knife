'use strict';var _from = require('babel-runtime/core-js/array/from');var _from2 = _interopRequireDefault(_from);var _isNan = require('babel-runtime/core-js/number/is-nan');var _isNan2 = _interopRequireDefault(_isNan);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _getIterator2 = require('babel-runtime/core-js/get-iterator');var _getIterator3 = _interopRequireDefault(_getIterator2);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _iterator2 = require('babel-runtime/core-js/symbol/iterator');var _iterator3 = _interopRequireDefault(_iterator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var diff = require('jest-diff'); /**
                                  * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                  *
                                  * This source code is licensed under the BSD-style license found in the
                                  * LICENSE file in the root directory of this source tree. An additional grant
                                  * of patent rights can be found in the PATENTS file in the same directory.
                                  *
                                  * 
                                  */var _require = require('jest-regex-util'),escapeStrForRegex = _require.escapeStrForRegex;var _require2 =



require('jest-matcher-utils'),EXPECTED_COLOR = _require2.EXPECTED_COLOR,RECEIVED_COLOR = _require2.RECEIVED_COLOR,ensureNoExpected = _require2.ensureNoExpected,ensureNumbers = _require2.ensureNumbers,getType = _require2.getType,matcherHint = _require2.matcherHint,printReceived = _require2.printReceived,printExpected = _require2.printExpected,printWithType = _require2.printWithType;var _require3 =
require('./utils'),getObjectSubset = _require3.getObjectSubset,getPath = _require3.getPath,hasOwnProperty = _require3.hasOwnProperty;var _require4 =
require('./jasmine-utils'),equals = _require4.equals;








var IteratorSymbol = _iterator3.default;

var hasIterator = function hasIterator(object) {return !!(object != null && object[IteratorSymbol]);};
var iterableEquality = function iterableEquality(a, b) {
  if (
  (typeof a === 'undefined' ? 'undefined' : (0, _typeof3.default)(a)) !== 'object' ||
  (typeof b === 'undefined' ? 'undefined' : (0, _typeof3.default)(b)) !== 'object' ||
  Array.isArray(a) ||
  Array.isArray(b) ||
  !hasIterator(a) ||
  !hasIterator(b))
  {
    return undefined;
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  var bIterator = b[IteratorSymbol]();var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

    for (var _iterator = (0, _getIterator3.default)(a), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var aValue = _step.value;
      var nextB = bIterator.next();
      if (nextB.done || !equals(aValue, nextB.value, [iterableEquality])) {
        return false;
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  if (!bIterator.next().done) {
    return false;
  }
  return true;
};
var isObjectWithKeys = function isObjectWithKeys(a) {return (
    a !== null &&
    (typeof a === 'undefined' ? 'undefined' : (0, _typeof3.default)(a)) === 'object' &&
    !(a instanceof Array) &&
    !(a instanceof Date));};
var subsetEquality = function subsetEquality(object, subset) {
  if (!isObjectWithKeys(object) || !isObjectWithKeys(subset)) {
    return undefined;
  }
  return (0, _keys2.default)(subset).every(
  function (key) {return (
      hasOwnProperty(object, key) &&
      equals(object[key], subset[key], [iterableEquality, subsetEquality]));});

};

var matchers = {
  toBe: function toBe(received, expected) {var _this = this;
    var pass = received === expected;

    var message = pass ?
    function () {return (
        matcherHint('.not.toBe') +
        '\n\n' + 'Expected value to not be (using ===):\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received)));} :
    function () {
      var diffString = diff(expected, received, {
        expand: _this.expand });

      return (
        matcherHint('.toBe') +
        '\n\n' + 'Expected value to be (using ===):\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received)) + (
        diffString ? '\n\nDifference:\n\n' + diffString : ''));

    };

    // Passing the the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message
    return { actual: received, expected: expected, message: message, name: 'toBe', pass: pass };
  },

  toBeCloseTo: function toBeCloseTo(actual, expected) {var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
    ensureNumbers(actual, expected, '.toBeCloseTo');
    var pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeCloseTo', 'received', 'expected, precision') +
        '\n\n' + ('Expected value not to be close to (with ' +
        printExpected(precision) + '-digit precision):\n') + ('  ' +
        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeCloseTo', 'received', 'expected, precision') +
        '\n\n' + ('Expected value to be close to (with ' +
        printExpected(precision) + '-digit precision):\n') + ('  ' +
        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));};

    return { message: message, pass: pass };
  },

  toBeDefined: function toBeDefined(actual, expected) {
    ensureNoExpected(expected, '.toBeDefined');
    var pass = actual !== void 0;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeDefined', 'received', '') +
        '\n\n' + 'Expected value not to be defined, instead received\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeDefined', 'received', '') +
        '\n\n' + 'Expected value to be defined, instead received\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeFalsy: function toBeFalsy(actual, expected) {
    ensureNoExpected(expected, '.toBeFalsy');
    var pass = !actual;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeFalsy', 'received', '') +
        '\n\n' + 'Expected value not to be falsy, instead received\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeFalsy', 'received', '') +
        '\n\n' + 'Expected value to be falsy, instead received\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeGreaterThan: function toBeGreaterThan(actual, expected) {
    ensureNumbers(actual, expected, '.toBeGreaterThan');
    var pass = actual > expected;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeGreaterThan') +
        '\n\n' + 'Expected value not to be greater than:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeGreaterThan') +
        '\n\n' + 'Expected value to be greater than:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeGreaterThanOrEqual: function toBeGreaterThanOrEqual(actual, expected) {
    ensureNumbers(actual, expected, '.toBeGreaterThanOrEqual');
    var pass = actual >= expected;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeGreaterThanOrEqual') +
        '\n\n' + 'Expected value not to be greater than or equal:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeGreaterThanOrEqual') +
        '\n\n' + 'Expected value to be greater than or equal:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeInstanceOf: function toBeInstanceOf(received, constructor) {
    var constType = getType(constructor);

    if (constType !== 'function') {
      throw new Error(
      matcherHint('[.not].toBeInstanceOf', 'value', 'constructor') + '\n\n' + 'Expected constructor to be a function. Instead got:\n' + ('  ' +


      printExpected(constType)));

    }
    var pass = received instanceof constructor;

    var message = pass ?
    function () {return (
        matcherHint('.not.toBeInstanceOf', 'value', 'constructor') +
        '\n\n' + 'Expected value not to be an instance of:\n' + ('  ' +

        printExpected(constructor.name || constructor) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received) + '\n'));} :
    function () {return (
        matcherHint('.toBeInstanceOf', 'value', 'constructor') +
        '\n\n' + 'Expected value to be an instance of:\n' + ('  ' +

        printExpected(constructor.name || constructor) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received) + '\n') + 'Constructor:\n' + ('  ' +

        printReceived(received.constructor && received.constructor.name)));};

    return { message: message, pass: pass };
  },

  toBeLessThan: function toBeLessThan(actual, expected) {
    ensureNumbers(actual, expected, '.toBeLessThan');
    var pass = actual < expected;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeLessThan') +
        '\n\n' + 'Expected value not to be less than:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeLessThan') +
        '\n\n' + 'Expected value to be less than:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeLessThanOrEqual: function toBeLessThanOrEqual(actual, expected) {
    ensureNumbers(actual, expected, '.toBeLessThanOrEqual');
    var pass = actual <= expected;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeLessThanOrEqual') +
        '\n\n' + 'Expected value not to be less than or equal:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeLessThanOrEqual') +
        '\n\n' + 'Expected value to be less than or equal:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeNaN: function toBeNaN(actual, expected) {
    ensureNoExpected(expected, '.toBeNaN');
    var pass = (0, _isNan2.default)(actual);
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeNaN', 'received', '') +
        '\n\n' + 'Expected value not to be NaN, instead received\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeNaN', 'received', '') +
        '\n\n' + 'Expected value to be NaN, instead received\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeNull: function toBeNull(actual, expected) {
    ensureNoExpected(expected, '.toBeNull');
    var pass = actual === null;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeNull', 'received', '') +
        '\n\n' + 'Expected value not to be null, instead received\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeNull', 'received', '') +
        '\n\n' + 'Expected value to be null, instead received\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeTruthy: function toBeTruthy(actual, expected) {
    ensureNoExpected(expected, '.toBeTruthy');
    var pass = !!actual;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeTruthy', 'received', '') +
        '\n\n' + 'Expected value not to be truthy, instead received\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeTruthy', 'received', '') +
        '\n\n' + 'Expected value to be truthy, instead received\n' + ('  ' +

        printReceived(actual)));};
    return { message: message, pass: pass };
  },

  toBeUndefined: function toBeUndefined(actual, expected) {
    ensureNoExpected(expected, '.toBeUndefined');
    var pass = actual === void 0;
    var message = pass ?
    function () {return (
        matcherHint('.not.toBeUndefined', 'received', '') +
        '\n\n' + 'Expected value not to be undefined, instead received\n' + ('  ' +

        printReceived(actual)));} :
    function () {return (
        matcherHint('.toBeUndefined', 'received', '') +
        '\n\n' + 'Expected value to be undefined, instead received\n' + ('  ' +

        printReceived(actual)));};

    return { message: message, pass: pass };
  },

  toContain: function toContain(collection, value) {
    var collectionType = getType(collection);

    var converted = null;
    if (Array.isArray(collection) || typeof collection === 'string') {
      // strings have `indexOf` so we don't need to convert
      // arrays have `indexOf` and we don't want to make a copy
      converted = collection;
    } else {
      try {
        converted = (0, _from2.default)(collection);
      } catch (e) {
        throw new Error(
        matcherHint('[.not].toContainEqual', 'collection', 'value') +
        '\n\n' + ('Expected ' +
        RECEIVED_COLOR('collection') + ' to be an array-like structure.\n') +
        printWithType('Received', collection, printReceived));

      }
    }
    // At this point, we're either a string or an Array,
    // which was converted from an array-like structure.
    var pass = converted.indexOf(value) != -1;
    var message = pass ?
    function () {return (
        matcherHint('.not.toContain', collectionType, 'value') +
        '\n\n' + ('Expected ' +
        collectionType + ':\n') + ('  ' +
        printReceived(collection) + '\n') + 'Not to contain value:\n' + ('  ' +

        printExpected(value) + '\n'));} :
    function () {return (
        matcherHint('.toContain', collectionType, 'value') +
        '\n\n' + ('Expected ' +
        collectionType + ':\n') + ('  ' +
        printReceived(collection) + '\n') + 'To contain value:\n' + ('  ' +

        printExpected(value)));};

    return { message: message, pass: pass };
  },

  toContainEqual: function toContainEqual(collection, value) {
    var collectionType = getType(collection);
    var converted = null;
    if (Array.isArray(collection)) {
      converted = collection;
    } else {
      try {
        converted = (0, _from2.default)(collection);
      } catch (e) {
        throw new Error(
        matcherHint('[.not].toContainEqual', 'collection', 'value') +
        '\n\n' + ('Expected ' +
        RECEIVED_COLOR('collection') + ' to be an array-like structure.\n') +
        printWithType('Received', collection, printReceived));

      }
    }

    var pass =
    converted.findIndex(function (item) {return equals(item, value, [iterableEquality]);}) !==
    -1;
    var message = pass ?
    function () {return (
        matcherHint('.not.toContainEqual', collectionType, 'value') +
        '\n\n' + ('Expected ' +
        collectionType + ':\n') + ('  ' +
        printReceived(collection) + '\n') + 'Not to contain a value equal to:\n' + ('  ' +

        printExpected(value) + '\n'));} :
    function () {return (
        matcherHint('.toContainEqual', collectionType, 'value') +
        '\n\n' + ('Expected ' +
        collectionType + ':\n') + ('  ' +
        printReceived(collection) + '\n') + 'To contain a value equal to:\n' + ('  ' +

        printExpected(value)));};

    return { message: message, pass: pass };
  },

  toEqual: function toEqual(received, expected) {var _this2 = this;
    var pass = equals(received, expected, [iterableEquality]);

    var message = pass ?
    function () {return (
        matcherHint('.not.toEqual') +
        '\n\n' + 'Expected value to not equal:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received)));} :
    function () {
      var diffString = diff(expected, received, {
        expand: _this2.expand });

      return (
        matcherHint('.toEqual') +
        '\n\n' + 'Expected value to equal:\n' + ('  ' +

        printExpected(expected) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received)) + (
        diffString ? '\n\nDifference:\n\n' + diffString : ''));

    };

    // Passing the the actual and expected objects so that a custom reporter
    // could access them, for example in order to display a custom visual diff,
    // or create a different error message
    return { actual: received, expected: expected, message: message, name: 'toEqual', pass: pass };
  },

  toHaveLength: function toHaveLength(received, length) {
    if (
    typeof received !== 'string' && (
    !received || typeof received.length !== 'number'))
    {
      throw new Error(
      matcherHint('[.not].toHaveLength', 'received', 'length') +
      '\n\n' + 'Expected value to have a \'length\' property that is a number. ' + 'Received:\n' + ('  ' +


      printReceived(received) + '\n') + (
      received ? 'received.length:\n  ' +
      printReceived(received.length) :
      ''));

    }

    var pass = received.length === length;
    var message = pass ?
    function () {return (
        matcherHint('.not.toHaveLength', 'received', 'length') +
        '\n\n' + 'Expected value to not have length:\n' + ('  ' +

        printExpected(length) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received) + '\n') + 'received.length:\n' + ('  ' +

        printReceived(received.length)));} :
    function () {return (
        matcherHint('.toHaveLength', 'received', 'length') +
        '\n\n' + 'Expected value to have length:\n' + ('  ' +

        printExpected(length) + '\n') + 'Received:\n' + ('  ' +

        printReceived(received) + '\n') + 'received.length:\n' + ('  ' +

        printReceived(received.length)));};

    return { message: message, pass: pass };
  },

  toHaveProperty: function toHaveProperty(object, keyPath, value) {
    var valuePassed = arguments.length === 3;

    if (!object && typeof object !== 'string' && typeof object !== 'number') {
      throw new Error(
      matcherHint('[.not].toHaveProperty', 'object', 'path', {
        secondArgument: valuePassed ? 'value' : null }) +

      '\n\n' + ('Expected ' +
      RECEIVED_COLOR('object') + ' to be an object. Received:\n') + ('  ' +
      getType(object) + ': ' + printReceived(object)));

    }

    if (getType(keyPath) !== 'string') {
      throw new Error(
      matcherHint('[.not].toHaveProperty', 'object', 'path', {
        secondArgument: valuePassed ? 'value' : null }) +

      '\n\n' + ('Expected ' +
      EXPECTED_COLOR('path') + ' to be a string. Received:\n') + ('  ' +
      getType(keyPath) + ': ' + printReceived(keyPath)));

    }

    var result = getPath(object, keyPath);var
    lastTraversedObject = result.lastTraversedObject,hasEndProp = result.hasEndProp;

    var diffString = void 0;

    if (valuePassed && hasOwnProperty(result, 'value')) {
      diffString = diff(value, result.value, {
        expand: this.expand });

    }

    var pass = valuePassed ?
    equals(result.value, value, [iterableEquality]) :
    hasEndProp;

    if (hasOwnProperty(result, 'value')) {
      // we don't diff numbers. So instead we'll show the object that contains the resulting value.
      // And to get that object we need to go up a level.
      result.traversedPath.pop();
    }
    var traversedPath = result.traversedPath.join('.');

    var message = pass ?
    matcherHint('.not.toHaveProperty', 'object', 'path', {
      secondArgument: valuePassed ? 'value' : null }) +

    '\n\n' + 'Expected the object:\n' + ('  ' +

    printReceived(object) + '\n') + 'Not to have a nested property:\n' + ('  ' +

    printExpected(keyPath) + '\n') + (
    valuePassed ? 'With a value of:\n  ' + printExpected(value) + '\n' : '') :
    matcherHint('.toHaveProperty', 'object', 'path', {
      secondArgument: valuePassed ? 'value' : null }) +

    '\n\n' + 'Expected the object:\n' + ('  ' +

    printReceived(object) + '\n') + 'To have a nested property:\n' + ('  ' +

    printExpected(keyPath) + '\n') + (
    valuePassed ? 'With a value of:\n  ' + printExpected(value) + '\n' : '') + (
    traversedPath ? 'Received:\n  ' +
    RECEIVED_COLOR('object') + '.' + traversedPath + ': ' + printReceived(lastTraversedObject) :
    '') + (
    diffString ? '\nDifference:\n\n' + diffString : '');
    if (pass === undefined) {
      throw new Error('pass must be initialized');
    }

    return { message: message, pass: pass };
  },

  toMatch: function toMatch(received, expected) {
    if (typeof received !== 'string') {
      throw new Error(
      matcherHint('[.not].toMatch', 'string', 'expected') +
      '\n\n' + (
      RECEIVED_COLOR('string') + ' value must be a string.\n') +
      printWithType('Received', received, printReceived));

    }

    if (!(expected instanceof RegExp) && !(typeof expected === 'string')) {
      throw new Error(
      matcherHint('[.not].toMatch', 'string', 'expected') +
      '\n\n' + (
      EXPECTED_COLOR('expected') + ' value must be a string or a regular expression.\n') +
      printWithType('Expected', expected, printExpected));

    }

    var pass = new RegExp(
    typeof expected === 'string' ? escapeStrForRegex(expected) : expected).
    test(received);
    var message = pass ?
    function () {return (
        matcherHint('.not.toMatch') + '\n\nExpected value not to match:\n' + ('  ' +

        printExpected(expected)) + '\nReceived:\n' + ('  ' +

        printReceived(received)));} :
    function () {return (
        matcherHint('.toMatch') + '\n\nExpected value to match:\n' + ('  ' +

        printExpected(expected)) + '\nReceived:\n' + ('  ' +

        printReceived(received)));};

    return { message: message, pass: pass };
  },

  toMatchObject: function toMatchObject(receivedObject, expectedObject) {var _this3 = this;
    if ((typeof receivedObject === 'undefined' ? 'undefined' : (0, _typeof3.default)(receivedObject)) !== 'object' || receivedObject === null) {
      throw new Error(
      matcherHint('[.not].toMatchObject', 'object', 'expected') +
      '\n\n' + (
      RECEIVED_COLOR('received') + ' value must be an object.\n') +
      printWithType('Received', receivedObject, printReceived));

    }

    if ((typeof expectedObject === 'undefined' ? 'undefined' : (0, _typeof3.default)(expectedObject)) !== 'object' || expectedObject === null) {
      throw new Error(
      matcherHint('[.not].toMatchObject', 'object', 'expected') +
      '\n\n' + (
      EXPECTED_COLOR('expected') + ' value must be an object.\n') +
      printWithType('Expected', expectedObject, printExpected));

    }

    var pass = equals(receivedObject, expectedObject, [
    iterableEquality,
    subsetEquality]);


    var message = pass ?
    function () {return (
        matcherHint('.not.toMatchObject') + '\n\nExpected value not to match object:\n' + ('  ' +

        printExpected(expectedObject)) + '\nReceived:\n' + ('  ' +

        printReceived(receivedObject)));} :
    function () {
      var diffString = diff(
      expectedObject,
      getObjectSubset(receivedObject, expectedObject),
      {
        expand: _this3.expand });


      return (
        matcherHint('.toMatchObject') + '\n\nExpected value to match object:\n' + ('  ' +

        printExpected(expectedObject)) + '\nReceived:\n' + ('  ' +

        printReceived(receivedObject)) + (
        diffString ? '\nDifference:\n' + diffString : ''));

    };

    return { message: message, pass: pass };
  } };


module.exports = matchers;