'use strict';var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _get2 = require('babel-runtime/helpers/get');var _get3 = _interopRequireDefault(_get2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _require =












require('util'),format = _require.format; /**
                                           * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                           *
                                           * This source code is licensed under the BSD-style license found in the
                                           * LICENSE file in the root directory of this source tree. An additional grant
                                           * of patent rights can be found in the PATENTS file in the same directory.
                                           *
                                           * 
                                           */ /* global stream$Writable */var _require2 = require('console'),Console = _require2.Console;var clearLine = require('./clearLine');var CustomConsole = function (_Console) {(0, _inherits3.default)(CustomConsole, _Console);


  function CustomConsole(
  stdout,
  stderr,
  formatBuffer)
  {(0, _classCallCheck3.default)(this, CustomConsole);var _this = (0, _possibleConstructorReturn3.default)(this, (CustomConsole.__proto__ || (0, _getPrototypeOf2.default)(CustomConsole)).call(this,
    stdout, stderr));
    _this._formatBuffer = formatBuffer || function (type, message) {return message;};return _this;
  }(0, _createClass3.default)(CustomConsole, [{ key: '_log', value: function _log(

    type, message) {
      clearLine(this._stdout);
      (0, _get3.default)(CustomConsole.prototype.__proto__ || (0, _getPrototypeOf2.default)(CustomConsole.prototype), 'log', this).call(this, this._formatBuffer(type, message));
    } }, { key: 'log', value: function log()

    {
      this._log('log', format.apply(null, arguments));
    } }, { key: 'info', value: function info()

    {
      this._log('info', format.apply(null, arguments));
    } }, { key: 'warn', value: function warn()

    {
      this._log('warn', format.apply(null, arguments));
    } }, { key: 'error', value: function error()

    {
      this._log('error', format.apply(null, arguments));
    } }, { key: 'getBuffer', value: function getBuffer()

    {
      return null;
    } }]);return CustomConsole;}(Console);


module.exports = CustomConsole;