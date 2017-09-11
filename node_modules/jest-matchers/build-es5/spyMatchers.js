'use strict';











var CALL_PRINT_LIMIT = 3; /**
                           * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                           *
                           * This source code is licensed under the BSD-style license found in the
                           * LICENSE file in the root directory of this source tree. An additional grant
                           * of patent rights can be found in the PATENTS file in the same directory.
                           *
                           * 
                           */var LAST_CALL_PRINT_LIMIT = 1;var _require =



require('jest-matcher-utils'),ensureExpectedIsNumber = _require.ensureExpectedIsNumber,ensureNoExpected = _require.ensureNoExpected,EXPECTED_COLOR = _require.EXPECTED_COLOR,matcherHint = _require.matcherHint,pluralize = _require.pluralize,printExpected = _require.printExpected,printReceived = _require.printReceived,printWithType = _require.printWithType,RECEIVED_COLOR = _require.RECEIVED_COLOR;var _require2 =
require('./jasmine-utils'),equals = _require2.equals;

var RECEIVED_NAME = {
  'mock function': 'jest.fn()',
  spy: 'spy' };


var createToBeCalledMatcher = function createToBeCalledMatcher(matcherName) {return function (received, expected) {
    ensureNoExpected(expected, matcherName);
    ensureMock(received, matcherName);

    var receivedIsSpy = isSpy(received);
    var type = receivedIsSpy ? 'spy' : 'mock function';
    var count = receivedIsSpy ?
    received.calls.count() :
    received.mock.calls.length;
    var calls = receivedIsSpy ?
    received.calls.all().map(function (x) {return x.args;}) :
    received.mock.calls;
    var pass = count > 0;
    var message = pass ?
    function () {return (
        matcherHint('.not' + matcherName, RECEIVED_NAME[type], '') +
        '\n\n' + ('Expected ' +
        type + ' not to be called ') +
        formatReceivedCalls(calls, CALL_PRINT_LIMIT, { sameSentence: true }));} :
    function () {return (
        matcherHint(matcherName, RECEIVED_NAME[type], '') +
        '\n\n' + ('Expected ' +
        type + ' to have been called.'));};

    return { message: message, pass: pass };
  };};

var createToBeCalledWithMatcher = function createToBeCalledWithMatcher(matcherName) {return function (
  received)

  {for (var _len = arguments.length, expected = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {expected[_key - 1] = arguments[_key];}
    ensureMock(received, matcherName);

    var receivedIsSpy = isSpy(received);
    var type = receivedIsSpy ? 'spy' : 'mock function';
    var calls = receivedIsSpy ?
    received.calls.all().map(function (x) {return x.args;}) :
    received.mock.calls;
    var pass = calls.some(function (call) {return equals(call, expected);});

    var message = pass ?
    function () {return (
        matcherHint('.not' + matcherName, RECEIVED_NAME[type]) +
        '\n\n' + ('Expected ' +
        type + ' not to have been called with:\n') + ('  ' +
        printExpected(expected)));} :
    function () {return (
        matcherHint(matcherName, RECEIVED_NAME[type]) +
        '\n\n' + ('Expected ' +
        type + ' to have been called with:\n') + ('  ' +
        printExpected(expected) + '\n') +
        formatReceivedCalls(calls, CALL_PRINT_LIMIT));};

    return { message: message, pass: pass };
  };};

var createLastCalledWithMatcher = function createLastCalledWithMatcher(matcherName) {return function (
  received)

  {for (var _len2 = arguments.length, expected = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {expected[_key2 - 1] = arguments[_key2];}
    ensureMock(received, matcherName);

    var receivedIsSpy = isSpy(received);
    var type = receivedIsSpy ? 'spy' : 'mock function';
    var calls = receivedIsSpy ?
    received.calls.all().map(function (x) {return x.args;}) :
    received.mock.calls;
    var pass = equals(calls[calls.length - 1], expected);

    var message = pass ?
    function () {return (
        matcherHint('.not' + matcherName, RECEIVED_NAME[type]) +
        '\n\n' + ('Expected ' +
        type + ' to not have been last called with:\n') + ('  ' +
        printExpected(expected)));} :
    function () {return (
        matcherHint(matcherName, RECEIVED_NAME[type]) +
        '\n\n' + ('Expected ' +
        type + ' to have been last called with:\n') + ('  ' +
        printExpected(expected) + '\n') +
        formatReceivedCalls(calls, LAST_CALL_PRINT_LIMIT, { isLast: true }));};

    return { message: message, pass: pass };
  };};

var spyMatchers = {
  lastCalledWith: createLastCalledWithMatcher('.lastCalledWith'),
  toBeCalled: createToBeCalledMatcher('.toBeCalled'),
  toBeCalledWith: createToBeCalledWithMatcher('.toBeCalledWith'),
  toHaveBeenCalled: createToBeCalledMatcher('.toHaveBeenCalled'),
  toHaveBeenCalledTimes: function toHaveBeenCalledTimes(received, expected) {
    var matcherName = '.toHaveBeenCalledTimes';
    ensureExpectedIsNumber(expected, matcherName);
    ensureMock(received, matcherName);

    var receivedIsSpy = isSpy(received);
    var type = receivedIsSpy ? 'spy' : 'mock function';
    var count = receivedIsSpy ?
    received.calls.count() :
    received.mock.calls.length;
    var pass = count === expected;
    var message = pass ?
    function () {return (
        matcherHint(
        '.not' + matcherName,
        RECEIVED_NAME[type],
        String(expected)) + '\n\n' + ('Expected ' +


        type + ' not to be called ') + (
        EXPECTED_COLOR(pluralize('time', expected)) + ', but it was') + (' called exactly ' +
        RECEIVED_COLOR(pluralize('time', count)) + '.'));} :
    function () {return (
        matcherHint(matcherName, RECEIVED_NAME[type], String(expected)) +
        '\n\n' + ('Expected ' +
        type + ' to have been called ') + (
        EXPECTED_COLOR(pluralize('time', expected)) + ',') + (' but it was called ' +
        RECEIVED_COLOR(pluralize('time', count)) + '.'));};

    return { message: message, pass: pass };
  },
  toHaveBeenCalledWith: createToBeCalledWithMatcher('.toHaveBeenCalledWith'),
  toHaveBeenLastCalledWith: createLastCalledWithMatcher(
  '.toHaveBeenLastCalledWith') };



var isSpy = function isSpy(spy) {return spy.calls && typeof spy.calls.count === 'function';};

var ensureMock = function ensureMock(mockOrSpy, matcherName) {
  if (
  !mockOrSpy ||
  (mockOrSpy.calls === undefined || mockOrSpy.calls.all === undefined) &&
  mockOrSpy._isMockFunction !== true)
  {
    throw new Error(
    matcherHint('[.not]' + matcherName, 'jest.fn()', '') +
    '\n\n' + (
    RECEIVED_COLOR('jest.fn()') + ' value must be a mock function ') + 'or spy.\n' +

    printWithType('Received', mockOrSpy, printReceived));

  }
};

var formatReceivedCalls = function formatReceivedCalls(calls, limit, options) {
  if (calls.length) {
    var but = options && options.sameSentence ? 'but' : 'But';
    var count = calls.length - limit;
    var printedCalls = calls.
    slice(-limit).
    reverse().
    map(printReceived).
    join(', ');
    return (
      but + ' it was ' + (options && options.isLast ? 'last ' : '') + 'called ' + 'with:\n  ' +

      printedCalls + (
      count > 0 ?
      '\nand ' + RECEIVED_COLOR(pluralize('more call', count)) + '.' :
      ''));

  } else {
    return 'But it was ' + RECEIVED_COLOR('not called') + '.';
  }
};

module.exports = spyMatchers;