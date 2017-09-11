'use strict';













const chalk = require('chalk'); /**
                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                 *
                                 * This source code is licensed under the BSD-style license found in the
                                 * LICENSE file in the root directory of this source tree. An additional grant
                                 * of patent rights can be found in the PATENTS file in the same directory.
                                 *
                                 * 
                                 */var _require = require('./utils');const getSummary = _require.getSummary,trimAndFormatPath = _require.trimAndFormatPath,wrapAnsiString = _require.wrapAnsiString;const RUNNING_TEXT = ' RUNS ';const RUNNING = chalk.reset.inverse.yellow.bold(RUNNING_TEXT) + ' '; /**
                                                                                                                                                                                                                                                                                                        * This class is a perf optimization for sorting the list of currently
                                                                                                                                                                                                                                                                                                        * running tests. It tries to keep tests in the same positions without
                                                                                                                                                                                                                                                                                                        * shifting the whole list.
                                                                                                                                                                                                                                                                                                        */class CurrentTestList {

  constructor() {
    this._array = [];
  }

  add(testPath, config) {
    const index = this._array.indexOf(null);
    const record = { config, testPath };
    if (index !== -1) {
      this._array[index] = record;
    } else {
      this._array.push(record);
    }
  }

  delete(testPath) {
    const record = this._array.find(
    record => record && record.testPath === testPath);

    this._array[this._array.indexOf(record || null)] = null;
  }

  get() {
    return this._array;
  }}


/**
      * A class that generates the CLI status of currently running tests
      * and also provides an ANSI escape sequence to remove status lines
      * from the terminal.
      */
class Status {












  constructor() {
    this._cache = null;
    this._currentTests = new CurrentTestList();
    this._done = false;
    this._emitScheduled = false;
    this._estimatedTime = 0;
    this._height = 0;
    this._showStatus = false;
  }

  onChange(callback) {
    this._callback = callback;
  }

  runStarted(
  aggregatedResults,
  options)
  {
    this._estimatedTime = options && options.estimatedTime || 0;
    this._showStatus = options && options.showStatus;
    this._interval = setInterval(() => this._tick(), 1000);
    this._aggregatedResults = aggregatedResults;
    this._debouncedEmit();
  }

  runFinished() {
    this._done = true;
    clearInterval(this._interval);
    this._emit();
  }

  testStarted(testPath, config) {
    this._currentTests.add(testPath, config);
    if (!this._showStatus) {
      this._emit();
    } else {
      this._debouncedEmit();
    }
  }

  testFinished(
  config,
  testResult,
  aggregatedResults)
  {const
    testFilePath = testResult.testFilePath;
    this._aggregatedResults = aggregatedResults;
    this._currentTests.delete(testFilePath);
    this._debouncedEmit();
  }

  get() {
    if (this._cache) {
      return this._cache;
    }

    if (this._done) {
      return { clear: '', content: '' };
    }

    // $FlowFixMe
    const width = process.stdout.columns;
    let content = '\n';
    this._currentTests.get().forEach(record => {
      if (record) {const
        config = record.config,testPath = record.testPath;
        content +=
        wrapAnsiString(
        RUNNING +
        trimAndFormatPath(
        RUNNING_TEXT.length + 1,
        config,
        testPath,
        width),

        width) +
        '\n';
      }
    });

    if (this._showStatus && this._aggregatedResults) {
      content +=
      '\n' +
      getSummary(this._aggregatedResults, {
        estimatedTime: this._estimatedTime,
        roundTime: true,
        width });

    }

    let height = 0;

    for (let i = 0; i < content.length; i++) {
      if (content[i] === '\n') {
        height++;
      }
    }

    const clear = '\r\x1B[K\r\x1B[1A'.repeat(height);
    return this._cache = { clear, content };
  }

  _emit() {
    this._cache = null;
    this._lastUpdated = Date.now();
    this._callback();
  }

  _debouncedEmit() {
    if (!this._emitScheduled) {
      // Perf optimization to avoid two separate renders When
      // one test finishes and another test starts executing.
      this._emitScheduled = true;
      setTimeout(() => {
        this._emit();
        this._emitScheduled = false;
      }, 100);
    }
  }

  _tick() {
    this._debouncedEmit();
  }}


module.exports = Status;