'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */




const VERSION = require('../../package.json').version;

const logDebugMessages = (
globalConfig,
config,
pipe) =>
{
  /* $FlowFixMe */
  const testFramework = require(config.testRunner);
  const output = {
    config,
    framework: testFramework.name,
    globalConfig,
    version: VERSION };

  pipe.write(JSON.stringify(output, null, '  ') + '\n');
};

module.exports = logDebugMessages;