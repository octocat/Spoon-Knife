'use strict';













// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  process.exit(1);
}); /**
     * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */var _require = require('jest-haste-map');const ModuleMap = _require.ModuleMap;var _require2 = require('jest-message-util');const separateMessageFromStack = _require2.separateMessageFromStack;const Runtime = require('jest-runtime');const runTest = require('./runTest');








const formatError = error => {
  if (typeof error === 'string') {var _separateMessageFromS =
    separateMessageFromStack(error);const message = _separateMessageFromS.message,stack = _separateMessageFromS.stack;
    return {
      message,
      stack,
      type: 'Error' };

  }

  return {
    message: error.message,
    stack: error.stack,
    type: 'Error' };

};

const resolvers = Object.create(null);
const getResolver = (config, rawModuleMap) => {
  // In watch mode, the raw module map with all haste modules is passed from
  // the test runner to the watch command. This is because jest-haste-map's
  // watch mode does not persist the haste map on disk after every file change.
  // To make this fast and consistent, we pass it from the TestRunner.
  if (rawModuleMap) {
    return Runtime.createResolver(
    config,
    new ModuleMap(rawModuleMap.map, rawModuleMap.mocks));

  } else {
    const name = config.name;
    if (!resolvers[name]) {
      resolvers[name] = Runtime.createResolver(
      config,
      Runtime.createHasteMap(config).readModuleMap());

    }
    return resolvers[name];
  }
};

module.exports = (_ref,

callback) =>
{let config = _ref.config,globalConfig = _ref.globalConfig,path = _ref.path,rawModuleMap = _ref.rawModuleMap;
  let parentExited = false;
  const disconnectCallback = () => parentExited = true;
  const removeListener = () =>
  process.removeListener('disconnect', disconnectCallback);
  process.on('disconnect', disconnectCallback);

  try {
    runTest(path, globalConfig, config, getResolver(config, rawModuleMap)).then(
    result => {
      removeListener();
      if (!parentExited) {
        callback(null, result);
      }
    },
    error => {
      removeListener();
      if (!parentExited) {
        callback(formatError(error));
      }
    });

  } catch (error) {
    callback(formatError(error));
  }
};