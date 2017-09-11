'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */var _require =

require('events');const EventEmitter = _require.EventEmitter;





class TestWatcher extends EventEmitter {



  constructor(_ref) {let isWatchMode = _ref.isWatchMode;
    super();
    this.state = { interrupted: false };
    this._isWatchMode = isWatchMode;
  }

  setState(state) {
    Object.assign(this.state, state);
    this.emit('change', this.state);
  }

  isInterrupted() {
    return this.state.interrupted;
  }

  isWatchMode() {
    return this._isWatchMode;
  }}


module.exports = TestWatcher;