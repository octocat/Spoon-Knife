'use strict';


















const chalk = require('chalk'); /**
                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                 *
                                 * This source code is licensed under the BSD-style license found in the
                                 * LICENSE file in the root directory of this source tree. An additional grant
                                 * of patent rights can be found in the PATENTS file in the same directory.
                                 *
                                 * 
                                 */var _require = require('../constants');const ICONS = _require.ICONS;const DefaultReporter = require('./DefaultReporter');class VerboseReporter extends DefaultReporter {constructor(globalConfig) {super(globalConfig);
    this._globalConfig = globalConfig;
  }

  static filterTestResults(testResults) {
    return testResults.filter((_ref) => {let status = _ref.status;return status !== 'pending';});
  }

  static groupTestsBySuites(testResults) {
    const root = { suites: [], tests: [], title: '' };
    testResults.forEach(testResult => {
      let targetSuite = root;

      // Find the target suite for this test,
      // creating nested suites as necessary.
      for (const title of testResult.ancestorTitles) {
        let matchingSuite = targetSuite.suites.find(s => s.title === title);
        if (!matchingSuite) {
          matchingSuite = { suites: [], tests: [], title };
          targetSuite.suites.push(matchingSuite);
        }
        targetSuite = matchingSuite;
      }

      targetSuite.tests.push(testResult);
    });
    return root;
  }

  onTestResult(
  test,
  result,
  aggregatedResults)
  {
    super.onTestResult(test, result, aggregatedResults);
    if (!result.testExecError && !result.skipped) {
      this._logTestResults(result.testResults);
    }
  }

  _logTestResults(testResults) {
    this._logSuite(VerboseReporter.groupTestsBySuites(testResults), 0);
    this._logLine();
  }

  _logSuite(suite, indentLevel) {
    if (suite.title) {
      this._logLine(suite.title, indentLevel);
    }

    this._logTests(suite.tests, indentLevel + 1);

    suite.suites.forEach(suite => this._logSuite(suite, indentLevel + 1));
  }

  _getIcon(status) {
    if (status === 'failed') {
      return chalk.red(ICONS.failed);
    } else if (status === 'pending') {
      return chalk.yellow(ICONS.pending);
    } else {
      return chalk.green(ICONS.success);
    }
  }

  _logTest(test, indentLevel) {
    const status = this._getIcon(test.status);
    const time = test.duration ? ` (${test.duration.toFixed(0)}ms)` : '';
    this._logLine(status + ' ' + chalk.dim(test.title + time), indentLevel);
  }

  _logTests(tests, indentLevel) {
    if (this._globalConfig.expand) {
      tests.forEach(test => this._logTest(test, indentLevel));
    } else {
      const skippedCount = tests.reduce((result, test) => {
        if (test.status === 'pending') {
          result += 1;
        } else {
          this._logTest(test, indentLevel);
        }

        return result;
      }, 0);

      if (skippedCount > 0) {
        this._logSkippedTests(skippedCount, indentLevel);
      }
    }
  }

  _logSkippedTests(count, indentLevel) {
    const icon = this._getIcon('pending');
    const text = chalk.dim(`skipped ${count} test${count === 1 ? '' : 's'}`);

    this._logLine(`${icon} ${text}`, indentLevel);
  }

  _logLine(str, indentLevel) {
    const indentation = '  '.repeat(indentLevel || 0);
    this.log(indentation + (str || ''));
  }}


module.exports = VerboseReporter;