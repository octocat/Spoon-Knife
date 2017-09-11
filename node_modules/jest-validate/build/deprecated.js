'use strict';var _require =











require('./utils');const logValidationWarning = _require.logValidationWarning,DEPRECATION = _require.DEPRECATION; /**
                                                                                                                   * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                   *
                                                                                                                   * This source code is licensed under the BSD-style license found in the
                                                                                                                   * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                   * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                   *
                                                                                                                   * 
                                                                                                                   */const deprecationMessage = (message, options) => {const comment = options.comment;const name = options.title && options.title.deprecation || DEPRECATION;logValidationWarning(name, message, comment);};
const deprecationWarning = (
config,
option,
deprecatedOptions,
options) =>
{
  if (option in deprecatedOptions) {
    deprecationMessage(deprecatedOptions[option](config), options);

    return true;
  }

  return false;
};

module.exports = {
  deprecationWarning };