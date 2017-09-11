'use strict';











const path = require('path'); /**
                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                               *
                               * This source code is licensed under the BSD-style license found in the
                               * LICENSE file in the root directory of this source tree. An additional grant
                               * of patent rights can be found in the PATENTS file in the same directory.
                               *
                               * 
                               */const SNAPSHOT_EXTENSION = 'snap';function isValidPath(globalConfig, config, filePath) {
  const coverageDirectory =
  globalConfig.coverageDirectory || path.resolve(config.rootDir, 'coverage');

  return (
    !filePath.includes(coverageDirectory) &&
    !filePath.endsWith(`.${SNAPSHOT_EXTENSION}`));

}

module.exports = isValidPath;