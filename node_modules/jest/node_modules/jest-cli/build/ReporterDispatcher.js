'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}



















class ReporterDispatcher {



  constructor() {
    this._reporters = [];
  }

  register(reporter) {
    this._reporters.push(reporter);
  }

  unregister(ReporterClass) {
    this._reporters = this._reporters.filter(
    reporter => !(reporter instanceof ReporterClass));

  }

  onTestResult(test, testResult, results) {
    this._reporters.forEach(
    reporter =>
    reporter.onTestResult &&
    reporter.onTestResult(test, testResult, results));

  }

  onTestStart(test) {
    this._reporters.forEach(
    reporter => reporter.onTestStart && reporter.onTestStart(test));

  }

  onRunStart(results, options) {
    this._reporters.forEach(
    reporter => reporter.onRunStart && reporter.onRunStart(results, options));

  }

  onRunComplete(contexts, results) {var _this = this;return _asyncToGenerator(function* () {
      for (const reporter of _this._reporters) {
        reporter.onRunComplete && (
        yield reporter.onRunComplete(contexts, results));
      }})();
  }

  // Return a list of last errors for every reporter
  getErrors() {
    return this._reporters.reduce((list, reporter) => {
      const error = reporter.getLastError && reporter.getLastError();
      return error ? list.concat(error) : list;
    }, []);
  }

  hasErrors() {
    return this.getErrors().length !== 0;
  }} /**
      * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
      *
      * This source code is licensed under the BSD-style license found in the
      * LICENSE file in the root directory of this source tree. An additional grant
      * of patent rights can be found in the PATENTS file in the same directory.
      *
      * 
      */module.exports = ReporterDispatcher;