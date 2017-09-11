'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */




const fs = require('fs');
const generateEmptyCoverage = require('../generateEmptyCoverage');









function formatCoverageError(error, filename) {
  const message = `
    Failed to collect coverage from ${filename}
    ERROR: ${error}
    STACK: ${error.stack}
  `;

  return {
    message,
    stack: error.stack,
    type: 'ERROR' };

}

// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  process.exit(1);
});

module.exports = (_ref,

callback) =>
{let config = _ref.config,globalConfig = _ref.globalConfig,path = _ref.path;
  try {
    const source = fs.readFileSync(path, 'utf8');
    const result = generateEmptyCoverage(source, path, globalConfig, config);
    callback(null, result);
  } catch (error) {
    callback(formatCoverageError(error, path), undefined);
  }
};