'use strict';var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var defaultConfig = require('./defaultConfig'); /**
                                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                 *
                                                 * This source code is licensed under the BSD-style license found in the
                                                 * LICENSE file in the root directory of this source tree. An additional grant
                                                 * of patent rights can be found in the PATENTS file in the same directory.
                                                 *
                                                 * 
                                                 */var _validate = function _validate(config, options) {var hasDeprecationWarnings = false;for (var key in config) {if (options.deprecatedConfig && key in options.deprecatedConfig &&
    typeof options.deprecate === 'function')
    {
      var isDeprecatedKey = options.deprecate(
      config,
      key,
      options.deprecatedConfig,
      options);


      hasDeprecationWarnings = hasDeprecationWarnings || isDeprecatedKey;
    } else if (hasOwnProperty.call(options.exampleConfig, key)) {
      if (
      typeof options.condition === 'function' &&
      typeof options.error === 'function' &&
      !options.condition(config[key], options.exampleConfig[key]))
      {
        options.error(key, config[key], options.exampleConfig[key], options);
      }
    } else {
      options.unknown &&
      options.unknown(config, options.exampleConfig, key, options);
    }
  }

  return { hasDeprecationWarnings: hasDeprecationWarnings };
};

var validate = function validate(config, options) {
  _validate(options, defaultConfig); // validate against jest-validate config

  var defaultedOptions = (0, _assign2.default)(
  {},
  defaultConfig,
  options,
  { title: (0, _assign2.default)({}, defaultConfig.title, options.title) });var _validate2 =


  _validate(config, defaultedOptions),hasDeprecationWarnings = _validate2.hasDeprecationWarnings;

  return {
    hasDeprecationWarnings: hasDeprecationWarnings,
    isValid: true };

};

module.exports = validate;