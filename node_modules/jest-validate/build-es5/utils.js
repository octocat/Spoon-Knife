'use strict';var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */

var chalk = require('chalk');
var BULLET = chalk.bold('\u25CF');
var DEPRECATION = BULLET + ' Deprecation Warning';
var ERROR = BULLET + ' Validation Error';
var WARNING = BULLET + ' Validation Warning';

var format = function format(value) {return (
    typeof value === 'function' ?
    value.toString() :
    require('pretty-format')(value, { min: true }));};var

ValidationError = function (_Error) {(0, _inherits3.default)(ValidationError, _Error);



  function ValidationError(name, message, comment) {(0, _classCallCheck3.default)(this, ValidationError);var _this = (0, _possibleConstructorReturn3.default)(this, (ValidationError.__proto__ || (0, _getPrototypeOf2.default)(ValidationError)).call(this));

    comment = comment ? '\n\n' + comment : '\n';
    _this.name = '';
    _this.stack = '';
    _this.message = chalk.red(chalk.bold(name) + ':\n\n' + message + comment);
    Error.captureStackTrace(_this, function () {});return _this;
  }return ValidationError;}(Error);


var logValidationWarning = function logValidationWarning(
name,
message,
comment)
{
  comment = comment ? '\n\n' + comment : '\n';
  console.warn(chalk.yellow(chalk.bold(name) + ':\n\n' + message + comment));
};

var createDidYouMeanMessage = function createDidYouMeanMessage(
unrecognized,
allowedOptions)
{
  var leven = require('leven');
  var suggestion = allowedOptions.find(function (option) {
    var steps = leven(option, unrecognized);
    return steps < 3;
  });

  return suggestion ? 'Did you mean ' + chalk.bold(format(suggestion)) + '?' : '';
};

module.exports = {
  DEPRECATION: DEPRECATION,
  ERROR: ERROR,
  ValidationError: ValidationError,
  WARNING: WARNING,
  createDidYouMeanMessage: createDidYouMeanMessage,
  format: format,
  logValidationWarning: logValidationWarning };