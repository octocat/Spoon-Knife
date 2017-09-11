'use strict';var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _require =













require('jest-message-util'),formatStackTrace = _require.formatStackTrace; /**
                                                                            * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                            *
                                                                            * This source code is licensed under the BSD-style license found in the
                                                                            * LICENSE file in the root directory of this source tree. An additional grant
                                                                            * of patent rights can be found in the PATENTS file in the same directory.
                                                                            *
                                                                            * 
                                                                            */var setGlobal = require('./setGlobal');




















var MS_IN_A_YEAR = 31536000000;var

FakeTimers = function () {















  function FakeTimers(
  global,
  moduleMocker,
  config,
  maxLoops)
  {var _this = this;(0, _classCallCheck3.default)(this, FakeTimers);
    this._global = global;
    this._config = config;
    this._maxLoops = maxLoops || 100000;
    this._uuidCounter = 1;
    this._moduleMocker = moduleMocker;

    // Store original timer APIs for future reference
    this._timerAPIs = {
      clearImmediate: global.clearImmediate,
      clearInterval: global.clearInterval,
      clearTimeout: global.clearTimeout,
      nextTick: global.process && global.process.nextTick,
      setImmediate: global.setImmediate,
      setInterval: global.setInterval,
      setTimeout: global.setTimeout };


    this.reset();
    this._createMocks();

    // These globally-accessible function are now deprecated!
    // They will go away very soon, so do not use them!
    // Instead, use the versions available on the `jest` object
    global.mockRunTicksRepeatedly = this.runAllTicks.bind(this);
    global.mockRunTimersOnce = this.runOnlyPendingTimers.bind(this);
    global.mockRunTimersToTime = this.runTimersToTime.bind(this);
    global.mockRunTimersRepeatedly = this.runAllTimers.bind(this);
    global.mockClearTimers = this.clearAllTimers.bind(this);
    global.mockGetTimersCount = function () {return (0, _keys2.default)(_this._timers).length;};
  }(0, _createClass3.default)(FakeTimers, [{ key: 'clearAllTimers', value: function clearAllTimers()

    {var _this2 = this;
      this._immediates.forEach(function (immediate) {return (
          _this2._fakeClearImmediate(immediate.uuid));});

      for (var _uuid in this._timers) {
        delete this._timers[_uuid];
      }
    } }, { key: 'dispose', value: function dispose()

    {
      this._disposed = true;
      this.clearAllTimers();
    } }, { key: 'reset', value: function reset()

    {
      this._cancelledTicks = {};
      this._cancelledImmediates = {};
      this._now = 0;
      this._ticks = [];
      this._immediates = [];
      this._timers = {};
    } }, { key: 'runAllTicks', value: function runAllTicks()

    {
      this._checkFakeTimers();
      // Only run a generous number of ticks and then bail.
      // This is just to help avoid recursive loops
      var i = void 0;
      for (i = 0; i < this._maxLoops; i++) {
        var tick = this._ticks.shift();

        if (tick === undefined) {
          break;
        }

        if (!this._cancelledTicks.hasOwnProperty(tick.uuid)) {
          // Callback may throw, so update the map prior calling.
          this._cancelledTicks[tick.uuid] = true;
          tick.callback();
        }
      }

      if (i === this._maxLoops) {
        throw new Error(
        'Ran ' +
        this._maxLoops +
        ' ticks, and there are still more! ' +
        "Assuming we've hit an infinite recursion and bailing out...");

      }
    } }, { key: 'runAllImmediates', value: function runAllImmediates()

    {
      this._checkFakeTimers();
      // Only run a generous number of immediates and then bail.
      var i = void 0;
      for (i = 0; i < this._maxLoops; i++) {
        var immediate = this._immediates.shift();
        if (immediate === undefined) {
          break;
        }
        this._runImmediate(immediate);
      }

      if (i === this._maxLoops) {
        throw new Error(
        'Ran ' +
        this._maxLoops +
        ' immediates, and there are still more! Assuming ' +
        "we've hit an infinite recursion and bailing out...");

      }
    } }, { key: '_runImmediate', value: function _runImmediate(

    immediate) {
      if (!this._cancelledImmediates.hasOwnProperty(immediate.uuid)) {
        // Callback may throw, so update the map prior calling.
        this._cancelledImmediates[immediate.uuid] = true;
        immediate.callback();
      }
    } }, { key: 'runAllTimers', value: function runAllTimers()

    {
      this._checkFakeTimers();
      this.runAllTicks();
      this.runAllImmediates();

      // Only run a generous number of timers and then bail.
      // This is just to help avoid recursive loops
      var i = void 0;
      for (i = 0; i < this._maxLoops; i++) {
        var nextTimerHandle = this._getNextTimerHandle();

        // If there are no more timer handles, stop!
        if (nextTimerHandle === null) {
          break;
        }

        this._runTimerHandle(nextTimerHandle);

        // Some of the immediate calls could be enqueued
        // during the previous handling of the timers, we should
        // run them as well.
        if (this._immediates.length) {
          this.runAllImmediates();
        }
      }

      if (i === this._maxLoops) {
        throw new Error(
        'Ran ' +
        this._maxLoops +
        ' timers, and there are still more! ' +
        "Assuming we've hit an infinite recursion and bailing out...");

      }
    } }, { key: 'runOnlyPendingTimers', value: function runOnlyPendingTimers()

    {
      this._checkFakeTimers();
      this._immediates.forEach(this._runImmediate, this);
      var timers = this._timers;
      (0, _keys2.default)(timers).
      sort(function (left, right) {return timers[left].expiry - timers[right].expiry;}).
      forEach(this._runTimerHandle, this);
    } }, { key: 'runTimersToTime', value: function runTimersToTime(

    msToRun) {
      this._checkFakeTimers();
      // Only run a generous number of timers and then bail.
      // This is jsut to help avoid recursive loops
      var i = void 0;
      for (i = 0; i < this._maxLoops; i++) {
        var timerHandle = this._getNextTimerHandle();

        // If there are no more timer handles, stop!
        if (timerHandle === null) {
          break;
        }

        var nextTimerExpiry = this._timers[timerHandle].expiry;
        if (this._now + msToRun < nextTimerExpiry) {
          // There are no timers between now and the target we're running to, so
          // adjust our time cursor and quit
          this._now += msToRun;
          break;
        } else {
          msToRun -= nextTimerExpiry - this._now;
          this._now = nextTimerExpiry;
          this._runTimerHandle(timerHandle);
        }
      }

      if (i === this._maxLoops) {
        throw new Error(
        'Ran ' +
        this._maxLoops +
        ' timers, and there are still more! ' +
        "Assuming we've hit an infinite recursion and bailing out...");

      }
    } }, { key: 'runWithRealTimers', value: function runWithRealTimers(

    cb) {
      var prevClearImmediate = this._global.clearImmediate;
      var prevClearInterval = this._global.clearInterval;
      var prevClearTimeout = this._global.clearTimeout;
      var prevNextTick = this._global.process.nextTick;
      var prevSetImmediate = this._global.setImmediate;
      var prevSetInterval = this._global.setInterval;
      var prevSetTimeout = this._global.setTimeout;

      this.useRealTimers();

      var cbErr = null;
      var errThrown = false;
      try {
        cb();
      } catch (e) {
        errThrown = true;
        cbErr = e;
      }

      this._global.clearImmediate = prevClearImmediate;
      this._global.clearInterval = prevClearInterval;
      this._global.clearTimeout = prevClearTimeout;
      this._global.process.nextTick = prevNextTick;
      this._global.setImmediate = prevSetImmediate;
      this._global.setInterval = prevSetInterval;
      this._global.setTimeout = prevSetTimeout;

      if (errThrown) {
        throw cbErr;
      }
    } }, { key: 'useRealTimers', value: function useRealTimers()

    {
      var global = this._global;
      setGlobal(global, 'clearImmediate', this._timerAPIs.clearImmediate);
      setGlobal(global, 'clearInterval', this._timerAPIs.clearInterval);
      setGlobal(global, 'clearTimeout', this._timerAPIs.clearTimeout);
      setGlobal(global, 'setImmediate', this._timerAPIs.setImmediate);
      setGlobal(global, 'setInterval', this._timerAPIs.setInterval);
      setGlobal(global, 'setTimeout', this._timerAPIs.setTimeout);

      global.process.nextTick = this._timerAPIs.nextTick;
    } }, { key: 'useFakeTimers', value: function useFakeTimers()

    {
      this._createMocks();

      var global = this._global;
      setGlobal(global, 'clearImmediate', this._fakeTimerAPIs.clearImmediate);
      setGlobal(global, 'clearInterval', this._fakeTimerAPIs.clearInterval);
      setGlobal(global, 'clearTimeout', this._fakeTimerAPIs.clearTimeout);
      setGlobal(global, 'setImmediate', this._fakeTimerAPIs.setImmediate);
      setGlobal(global, 'setInterval', this._fakeTimerAPIs.setInterval);
      setGlobal(global, 'setTimeout', this._fakeTimerAPIs.setTimeout);

      global.process.nextTick = this._fakeTimerAPIs.nextTick;
    } }, { key: '_checkFakeTimers', value: function _checkFakeTimers()

    {
      if (this._global.setTimeout !== this._fakeTimerAPIs.setTimeout) {
        this._global.console.warn(
        'A function to advance timers was called but the timers API is not ' + 'mocked with fake timers. Call `jest.useFakeTimers()` in this ' + 'test or enable fake timers globally by setting ' + '`"timers": "fake"` in ' + 'the configuration file. This warning is likely a result of a ' + 'default configuration change in Jest 15.\n\n' + 'Release Blog Post: https://facebook.github.io/jest/blog/2016/09/01/jest-15.html\n' + 'Stack Trace:\n' +







        formatStackTrace(new Error().stack, this._config, {
          noStackTrace: false }));


      }
    } }, { key: '_createMocks', value: function _createMocks()

    {var _this3 = this;
      var fn = function fn(impl) {return _this3._moduleMocker.fn().mockImplementation(impl);};

      this._fakeTimerAPIs = {
        clearImmediate: fn(this._fakeClearImmediate.bind(this)),
        clearInterval: fn(this._fakeClearTimer.bind(this)),
        clearTimeout: fn(this._fakeClearTimer.bind(this)),
        nextTick: fn(this._fakeNextTick.bind(this)),
        setImmediate: fn(this._fakeSetImmediate.bind(this)),
        setInterval: fn(this._fakeSetInterval.bind(this)),
        setTimeout: fn(this._fakeSetTimeout.bind(this)) };

    } }, { key: '_fakeClearTimer', value: function _fakeClearTimer(

    uuid) {
      if (this._timers.hasOwnProperty(uuid)) {
        delete this._timers[uuid];
      }
    } }, { key: '_fakeClearImmediate', value: function _fakeClearImmediate(

    uuid) {
      this._cancelledImmediates[uuid] = true;
    } }, { key: '_fakeNextTick', value: function _fakeNextTick(

    callback) {var _this4 = this;
      if (this._disposed) {
        return;
      }

      var args = [];
      for (var ii = 1, ll = arguments.length; ii < ll; ii++) {
        args.push(arguments[ii]);
      }

      var uuid = String(this._uuidCounter++);

      this._ticks.push({
        callback: function (_callback) {function callback() {return _callback.apply(this, arguments);}callback.toString = function () {return _callback.toString();};return callback;}(function () {return callback.apply(null, args);}),
        uuid: uuid });


      var cancelledTicks = this._cancelledTicks;
      this._timerAPIs.nextTick(function () {
        if (_this4._blocked) {
          return;
        }
        if (!cancelledTicks.hasOwnProperty(uuid)) {
          // Callback may throw, so update the map prior calling.
          cancelledTicks[uuid] = true;
          callback.apply(null, args);
        }
      });
    } }, { key: '_fakeSetImmediate', value: function _fakeSetImmediate(

    callback) {
      if (this._disposed) {
        return null;
      }

      var args = [];
      for (var ii = 1, ll = arguments.length; ii < ll; ii++) {
        args.push(arguments[ii]);
      }

      var uuid = this._uuidCounter++;

      this._immediates.push({
        callback: function (_callback2) {function callback() {return _callback2.apply(this, arguments);}callback.toString = function () {return _callback2.toString();};return callback;}(function () {return callback.apply(null, args);}),
        uuid: String(uuid) });


      var cancelledImmediates = this._cancelledImmediates;
      this._timerAPIs.setImmediate(function () {
        if (!cancelledImmediates.hasOwnProperty(uuid)) {
          // Callback may throw, so update the map prior calling.
          cancelledImmediates[String(uuid)] = true;
          callback.apply(null, args);
        }
      });

      return uuid;
    } }, { key: '_fakeSetInterval', value: function _fakeSetInterval(

    callback, intervalDelay) {
      if (this._disposed) {
        return null;
      }

      if (intervalDelay == null) {
        intervalDelay = 0;
      }

      var args = [];
      for (var ii = 2, ll = arguments.length; ii < ll; ii++) {
        args.push(arguments[ii]);
      }

      var uuid = this._uuidCounter++;

      this._timers[String(uuid)] = {
        callback: function (_callback3) {function callback() {return _callback3.apply(this, arguments);}callback.toString = function () {return _callback3.toString();};return callback;}(function () {return callback.apply(null, args);}),
        expiry: this._now + intervalDelay,
        interval: intervalDelay,
        type: 'interval' };


      return uuid;
    } }, { key: '_fakeSetTimeout', value: function _fakeSetTimeout(

    callback, delay) {
      if (this._disposed) {
        return null;
      }

      if (delay == null) {
        delay = 0;
      }

      var args = [];
      for (var ii = 2, ll = arguments.length; ii < ll; ii++) {
        args.push(arguments[ii]);
      }

      var uuid = this._uuidCounter++;

      this._timers[String(uuid)] = {
        callback: function (_callback4) {function callback() {return _callback4.apply(this, arguments);}callback.toString = function () {return _callback4.toString();};return callback;}(function () {return callback.apply(null, args);}),
        expiry: this._now + delay,
        interval: null,
        type: 'timeout' };


      return uuid;
    } }, { key: '_getNextTimerHandle', value: function _getNextTimerHandle()

    {
      var nextTimerHandle = null;
      var uuid = void 0;
      var soonestTime = MS_IN_A_YEAR;
      var timer = void 0;
      for (uuid in this._timers) {
        timer = this._timers[uuid];
        if (timer.expiry < soonestTime) {
          soonestTime = timer.expiry;
          nextTimerHandle = uuid;
        }
      }

      return nextTimerHandle;
    } }, { key: '_runTimerHandle', value: function _runTimerHandle(

    timerHandle) {
      var timer = this._timers[timerHandle];

      if (!timer) {
        return;
      }

      switch (timer.type) {
        case 'timeout':
          var _callback5 = timer.callback;
          delete this._timers[timerHandle];
          _callback5();
          break;

        case 'interval':
          timer.expiry = this._now + timer.interval;
          timer.callback();
          break;

        default:
          throw new Error('Unexpected timer type: ' + timer.type);}

    } }]);return FakeTimers;}();


module.exports = FakeTimers;