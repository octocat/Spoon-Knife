'use strict';var _require =












require('util');const format = _require.format; /**
                                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                 *
                                                 * This source code is licensed under the BSD-style license found in the
                                                 * LICENSE file in the root directory of this source tree. An additional grant
                                                 * of patent rights can be found in the PATENTS file in the same directory.
                                                 *
                                                 * 
                                                 */ /* global stream$Writable */var _require2 = require('console');const Console = _require2.Console;const clearLine = require('./clearLine');class CustomConsole extends Console {


  constructor(
  stdout,
  stderr,
  formatBuffer)
  {
    super(stdout, stderr);
    this._formatBuffer = formatBuffer || ((type, message) => message);
  }

  _log(type, message) {
    clearLine(this._stdout);
    super.log(this._formatBuffer(type, message));
  }

  log() {
    this._log('log', format.apply(null, arguments));
  }

  info() {
    this._log('info', format.apply(null, arguments));
  }

  warn() {
    this._log('warn', format.apply(null, arguments));
  }

  error() {
    this._log('error', format.apply(null, arguments));
  }

  getBuffer() {
    return null;
  }}


module.exports = CustomConsole;