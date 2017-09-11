'use strict';var _create = require('babel-runtime/core-js/object/create');var _create2 = _interopRequireDefault(_create);var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}




















var formatResult = function formatResult(
testResult,
codeCoverageFormatter,
reporter)
{
  var now = Date.now();
  var output = {
    assertionResults: [],
    coverage: {},
    endTime: now,
    message: '',
    name: testResult.testFilePath,
    startTime: now,
    status: 'failed',
    summary: '' };


  if (testResult.testExecError) {
    output.message = testResult.testExecError.message;
    output.coverage = {};
  } else {
    var allTestsPassed = testResult.numFailingTests === 0;
    output.status = allTestsPassed ? 'passed' : 'failed';
    output.startTime = testResult.perfStats.start;
    output.endTime = testResult.perfStats.end;
    output.coverage = codeCoverageFormatter(testResult.coverage, reporter);
  }

  output.assertionResults = testResult.testResults.map(formatTestAssertion);

  if (testResult.failureMessage) {
    output.message = testResult.failureMessage;
  }

  return output;
}; /**
    * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
    *
    * This source code is licensed under the BSD-style license found in the
    * LICENSE file in the root directory of this source tree. An additional grant
    * of patent rights can be found in the PATENTS file in the same directory.
    *
    * 
    */function formatTestAssertion(assertion) {var result = { failureMessages: null, status: assertion.status, title: assertion.title };

  if (assertion.failureMessages) {
    result.failureMessages = assertion.failureMessages;
  }
  return result;
}

function formatTestResults(
results,
codeCoverageFormatter,
reporter)
{
  var formatter = codeCoverageFormatter || function (coverage) {return coverage;};

  var testResults = results.testResults.map(function (testResult) {return (
      formatResult(testResult, formatter, reporter));});


  return (0, _assign2.default)((0, _create2.default)(null), results, {
    testResults: testResults });

}

module.exports = formatTestResults;