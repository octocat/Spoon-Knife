'use strict'; /**
               * Copyright (c) 2014, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */

var mkdirp = require('mkdirp');
var Console = require('./Console');
var FakeTimers = require('./FakeTimers');
var NullConsole = require('./NullConsole');

var clearLine = require('./clearLine');
var formatTestResults = require('./formatTestResults');
var installCommonGlobals = require('./installCommonGlobals');
var setGlobal = require('./setGlobal');
var validateCLIOptions = require('./validateCLIOptions');

var createDirectory = function createDirectory(path) {
  try {
    mkdirp.sync(path, '777');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
};

module.exports = {
  Console: Console,
  FakeTimers: FakeTimers,
  NullConsole: NullConsole,
  clearLine: clearLine,
  createDirectory: createDirectory,
  formatTestResults: formatTestResults,
  installCommonGlobals: installCommonGlobals,
  setGlobal: setGlobal,
  validateCLIOptions: validateCLIOptions };