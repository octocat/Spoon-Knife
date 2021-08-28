'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */






const preRunMessage = require('../preRunMessage');

class BaseReporter {


  log(message) {
    process.stderr.write(message + '\n');
  }

  onRunStart(results, options) {
    preRunMessage.remove(process.stderr);
  }

  onTestResult(test, testResult, results) {}

  onTestStart(test) {}

  onRunComplete(
  contexts,
  aggregatedResults)
  {}

  _setError(error) {
    this._error = error;
  }

  // Return an error that occurred during reporting. This error will
  // define whether the test run was successful or failed.
  getLastError() {
    return this._error;
  }}


module.exports = BaseReporter;