'use strict';var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _create = require('babel-runtime/core-js/object/create');var _create2 = _interopRequireDefault(_create);var _defineProperty = require('babel-runtime/core-js/object/define-property');var _defineProperty2 = _interopRequireDefault(_defineProperty);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _for = require('babel-runtime/core-js/symbol/for');var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}




















var utils = require('jest-matcher-utils'); /**
                                            * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                            *
                                            * This source code is licensed under the BSD-style license found in the
                                            * LICENSE file in the root directory of this source tree. An additional grant
                                            * of patent rights can be found in the PATENTS file in the same directory.
                                            *
                                            * 
                                            */var matchers = require('./matchers');var spyMatchers = require('./spyMatchers');var toThrowMatchers = require('./toThrowMatchers');var _require = require('./jasmine-utils'),equals = _require.equals;var _require2 =



require('./asymmetric-matchers'),any = _require2.any,anything = _require2.anything,arrayContaining = _require2.arrayContaining,objectContaining = _require2.objectContaining,stringContaining = _require2.stringContaining,stringMatching = _require2.stringMatching;

var GLOBAL_STATE = (0, _for2.default)('$$jest-matchers-object');var

JestAssertionError = function (_Error) {(0, _inherits3.default)(JestAssertionError, _Error);function JestAssertionError() {(0, _classCallCheck3.default)(this, JestAssertionError);return (0, _possibleConstructorReturn3.default)(this, (JestAssertionError.__proto__ || (0, _getPrototypeOf2.default)(JestAssertionError)).apply(this, arguments));}return JestAssertionError;}(Error);



var isPromise = function isPromise(obj) {
  return (
    !!obj && (
    (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function');

};

if (!global[GLOBAL_STATE]) {
  (0, _defineProperty2.default)(global, GLOBAL_STATE, {
    value: {
      matchers: (0, _create2.default)(null),
      state: {
        assertionCalls: 0,
        expectedAssertionsNumber: null,
        isExpectingAssertions: false,
        suppressedErrors: [] } } });



}

var expect = function expect(actual) {
  var allMatchers = global[GLOBAL_STATE].matchers;
  var expectation = {
    not: {},
    rejects: { not: {} },
    resolves: { not: {} } };


  (0, _keys2.default)(allMatchers).forEach(function (name) {
    expectation[name] = makeThrowingMatcher(allMatchers[name], false, actual);
    expectation.not[name] = makeThrowingMatcher(
    allMatchers[name],
    true,
    actual);


    expectation.resolves[name] = makeResolveMatcher(
    name,
    allMatchers[name],
    false,
    actual);

    expectation.resolves.not[name] = makeResolveMatcher(
    name,
    allMatchers[name],
    true,
    actual);


    expectation.rejects[name] = makeRejectMatcher(
    name,
    allMatchers[name],
    false,
    actual);

    expectation.rejects.not[name] = makeRejectMatcher(
    name,
    allMatchers[name],
    true,
    actual);

  });

  return expectation;
};

var getMessage = function getMessage(message) {
  // for performance reasons some of the messages are evaluated
  // lazily
  if (typeof message === 'function') {
    message = message();
  }

  if (!message) {
    message = utils.RECEIVED_COLOR(
    'No message was specified for this matcher.');

  }
  return message;
};

var makeResolveMatcher = function makeResolveMatcher(
matcherName,
matcher,
isNot,
actual) {return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(
  function _callee() {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}var matcherStatement, result;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            matcherStatement = '.resolves.' + (isNot ? 'not.' : '') + matcherName;if (
            isPromise(actual)) {_context.next = 3;break;}throw (
              new JestAssertionError(
              utils.matcherHint(matcherStatement, 'received', '') +
              '\n\n' + (
              utils.RECEIVED_COLOR('received') + ' value must be a Promise.\n') +
              utils.printWithType('Received', actual, utils.printReceived)));case 3:



            result = void 0;_context.prev = 4;_context.next = 7;return (

              actual);case 7:result = _context.sent;_context.next = 13;break;case 10:_context.prev = 10;_context.t0 = _context['catch'](4);throw (

              new JestAssertionError(
              utils.matcherHint(matcherStatement, 'received', '') +
              '\n\n' + ('Expected ' +
              utils.RECEIVED_COLOR('received') + ' Promise to resolve, ') +
              'instead it rejected to value\n' + ('  ' +
              utils.printReceived(_context.t0))));case 13:return _context.abrupt('return',


            makeThrowingMatcher(matcher, isNot, result).apply(null, args));case 14:case 'end':return _context.stop();}}}, _callee, undefined, [[4, 10]]);}));};


var makeRejectMatcher = function makeRejectMatcher(
matcherName,
matcher,
isNot,
actual) {return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(
  function _callee2() {for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}var matcherStatement, result;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            matcherStatement = '.rejects.' + (isNot ? 'not.' : '') + matcherName;if (
            isPromise(actual)) {_context2.next = 3;break;}throw (
              new JestAssertionError(
              utils.matcherHint(matcherStatement, 'received', '') +
              '\n\n' + (
              utils.RECEIVED_COLOR('received') + ' value must be a Promise.\n') +
              utils.printWithType('Received', actual, utils.printReceived)));case 3:



            result = void 0;_context2.prev = 4;_context2.next = 7;return (

              actual);case 7:result = _context2.sent;_context2.next = 13;break;case 10:_context2.prev = 10;_context2.t0 = _context2['catch'](4);return _context2.abrupt('return',

            makeThrowingMatcher(matcher, isNot, _context2.t0).apply(null, args));case 13:throw (


              new JestAssertionError(
              utils.matcherHint(matcherStatement, 'received', '') +
              '\n\n' + ('Expected ' +
              utils.RECEIVED_COLOR('received') + ' Promise to reject, ') +
              'instead it resolved to value\n' + ('  ' +
              utils.printReceived(result))));case 14:case 'end':return _context2.stop();}}}, _callee2, undefined, [[4, 10]]);}));};



var makeThrowingMatcher = function makeThrowingMatcher(
matcher,
isNot,
actual)
{
  return function throwingMatcher() {
    var throws = true;
    var matcherContext = (0, _assign2.default)(
    // When throws is disabled, the matcher will not throw errors during test
    // execution but instead add them to the global matcher state. If a
    // matcher throws, test execution is normally stopped immediately. The
    // snapshot matcher uses it because we want to log all snapshot
    // failures in a test.
    { dontThrow: function dontThrow() {return throws = false;} },
    global[GLOBAL_STATE].state,
    {
      equals: equals,
      isNot: isNot,
      utils: utils });


    var result = void 0;

    try {for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}
      result = matcher.apply(matcherContext, [actual].concat(args));
    } catch (error) {
      // Remove this and deeper functions from the stack trace frame.
      Error.captureStackTrace(error, throwingMatcher);
      throw error;
    }

    _validateResult(result);

    global[GLOBAL_STATE].state.assertionCalls++;

    if (result.pass && isNot || !result.pass && !isNot) {
      // XOR
      var message = getMessage(result.message);
      var error = new JestAssertionError(message);
      // Passing the result of the matcher with the error so that a custom
      // reporter could access the actual and expected objects of the result
      // for example in order to display a custom visual diff
      error.matcherResult = result;
      // Remove this function from the stack trace frame.
      Error.captureStackTrace(error, throwingMatcher);

      if (throws) {
        throw error;
      } else {
        global[GLOBAL_STATE].state.suppressedErrors.push(error);
      }
    }
  };
};

expect.extend = function (matchers) {
  (0, _assign2.default)(global[GLOBAL_STATE].matchers, matchers);
};

expect.anything = anything;
expect.any = any;
expect.objectContaining = objectContaining;
expect.arrayContaining = arrayContaining;
expect.stringContaining = stringContaining;
expect.stringMatching = stringMatching;

var _validateResult = function _validateResult(result) {
  if (
  (typeof result === 'undefined' ? 'undefined' : (0, _typeof3.default)(result)) !== 'object' ||
  typeof result.pass !== 'boolean' ||
  result.message &&
  typeof result.message !== 'string' &&
  typeof result.message !== 'function')
  {
    throw new Error(
    'Unexpected return from a matcher function.\n' +
    'Matcher functions should ' +
    'return an object in the following format:\n' +
    '  {message?: string | function, pass: boolean}\n' + ('\'' +
    utils.stringify(result) + '\' was returned'));

  }
};

// add default jest matchers
expect.extend(matchers);
expect.extend(spyMatchers);
expect.extend(toThrowMatchers);

expect.addSnapshotSerializer = function () {return void 0;};
expect.assertions = function (expected) {
  global[GLOBAL_STATE].state.expectedAssertionsNumber = expected;
};
expect.hasAssertions = function (expected) {
  utils.ensureNoExpected(expected, '.hasAssertions');
  global[GLOBAL_STATE].state.isExpectingAssertions = true;
};
expect.setState = function (state) {
  (0, _assign2.default)(global[GLOBAL_STATE].state, state);
};
expect.getState = function () {return global[GLOBAL_STATE].state;};

module.exports = expect;