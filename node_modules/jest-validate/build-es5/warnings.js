'use strict';var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var chalk = require('chalk'); /**
                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                               *
                               * This source code is licensed under the BSD-style license found in the
                               * LICENSE file in the root directory of this source tree. An additional grant
                               * of patent rights can be found in the PATENTS file in the same directory.
                               *
                               * 
                               */var _require = require('./utils'),format = _require.format,logValidationWarning = _require.logValidationWarning,createDidYouMeanMessage = _require.createDidYouMeanMessage,WARNING = _require.WARNING;var unknownOptionWarning = function unknownOptionWarning(
config,
exampleConfig,
option,
options)
{
  var didYouMean = createDidYouMeanMessage(
  option,
  (0, _keys2.default)(exampleConfig));

  var message =
  '  Unknown option ' + chalk.bold('"' + option + '"') + ' with value ' + chalk.bold(format(config[option])) + ' was found.' + (
  didYouMean && ' ' + didYouMean) + '\n  This is probably a typing mistake. Fixing it will remove this message.';


  var comment = options.comment;
  var name = options.title && options.title.warning || WARNING;

  logValidationWarning(name, message, comment);
};

module.exports = {
  unknownOptionWarning: unknownOptionWarning };