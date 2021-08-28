'use strict';var _clearImmediate2 = require('babel-runtime/core-js/clear-immediate');var _clearImmediate3 = _interopRequireDefault(_clearImmediate2);var _setImmediate2 = require('babel-runtime/core-js/set-immediate');var _setImmediate3 = _interopRequireDefault(_setImmediate2);var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);var _defineProperty2 = require('babel-runtime/helpers/defineProperty');var _defineProperty3 = _interopRequireDefault(_defineProperty2);var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');var _toStringTag2 = _interopRequireDefault(_toStringTag);var _symbol = require('babel-runtime/core-js/symbol');var _symbol2 = _interopRequireDefault(_symbol);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */




function deepCopy(obj) {
  var newObj = {};
  var value = void 0;
  for (var key in obj) {
    value = obj[key];
    if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && value !== null) {
      value = deepCopy(value);
    }
    newObj[key] = value;
  }
  return newObj;
}

module.exports = function (global, globals) {
  // Forward some APIs
  global.Buffer = Buffer;

  // `global.process` is mutated by FakeTimers. Make a copy of the
  // object for the jsdom environment to prevent memory leaks.
  // Overwrite toString to make it look like the real process object
  var toStringOverwrite = void 0;
  if (_symbol2.default && _toStringTag2.default) {
    // $FlowFixMe
    toStringOverwrite = (0, _defineProperty3.default)({}, _toStringTag2.default,
    'process');

  }
  global.process = (0, _assign2.default)({}, process, toStringOverwrite);
  global.process.setMaxListeners = process.setMaxListeners.bind(process);
  global.process.getMaxListeners = process.getMaxListeners.bind(process);
  global.process.emit = process.emit.bind(process);
  global.process.addListener = process.addListener.bind(process);
  global.process.on = process.on.bind(process);
  global.process.once = process.once.bind(process);
  global.process.removeListener = process.removeListener.bind(process);
  global.process.removeAllListeners = process.removeAllListeners.bind(process);
  global.process.listeners = process.listeners.bind(process);
  global.process.listenerCount = process.listenerCount.bind(process);

  global.setImmediate = _setImmediate3.default;
  global.clearImmediate = _clearImmediate3.default;

  (0, _assign2.default)(global, deepCopy(globals));
};