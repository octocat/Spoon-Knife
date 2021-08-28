'use strict';var _set = require('babel-runtime/core-js/set');var _set2 = _interopRequireDefault(_set);var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _from = require('babel-runtime/core-js/array/from');var _from2 = _interopRequireDefault(_from);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var chalk = require('chalk'); /**
                               * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                               *
                               * This source code is licensed under the BSD-style license found in the
                               * LICENSE file in the root directory of this source tree. An additional grant
                               * of patent rights can be found in the PATENTS file in the same directory.
                               *
                               * 
                               */var _require = require('jest-validate'),ValidationError = _require.ValidationError,format = _require.format,createDidYouMeanMessage = _require.createDidYouMeanMessage;var BULLET = chalk.bold('\u25CF');
var createCLIValidationError = function createCLIValidationError(
unrecognizedOptions,
allowedOptions)
{
  var title = BULLET + ' Unrecognized CLI Parameter';
  var message = void 0;
  var comment =
  '  ' + chalk.bold('CLI Options Documentation') + ':\n' + '  http://facebook.github.io/jest/docs/cli.html\n';


  if (unrecognizedOptions.length === 1) {
    var unrecognized = unrecognizedOptions[0];
    var didYouMeanMessage = createDidYouMeanMessage(
    unrecognized,
    (0, _from2.default)(allowedOptions));

    message =
    '  Unrecognized option ' + chalk.bold(format(unrecognized)) + '.' + (
    didYouMeanMessage ? ' ' + didYouMeanMessage : '');
  } else {
    title += 's';
    message =
    '  Following options were not recognized:\n' + ('  ' +
    chalk.bold(format(unrecognizedOptions)));
  }

  return new ValidationError(title, message, comment);
};

var validateCLIOptions = function validateCLIOptions(argv, options) {
  var yargsSpecialOptions = ['$0', '_', 'help', 'h'];
  var allowedOptions = (0, _keys2.default)(options).reduce(
  function (acc, option) {return acc.add(option).add(options[option].alias || option);},
  new _set2.default(yargsSpecialOptions));

  var unrecognizedOptions = (0, _keys2.default)(argv).filter(
  function (arg) {return !allowedOptions.has(arg);});


  if (unrecognizedOptions.length) {
    throw createCLIValidationError(unrecognizedOptions, allowedOptions);
  }

  return true;
};

module.exports = validateCLIOptions;