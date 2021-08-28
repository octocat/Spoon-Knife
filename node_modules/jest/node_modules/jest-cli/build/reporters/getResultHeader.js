'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */




const chalk = require('chalk');var _require =
require('./utils');const formatTestPath = _require.formatTestPath;

const LONG_TEST_COLOR = chalk.reset.bold.bgRed;
// Explicitly reset for these messages since they can get written out in the
// middle of error logging
const FAIL = chalk.reset.inverse.bold.red(' FAIL ');
const PASS = chalk.reset.inverse.bold.green(' PASS ');

module.exports = (result, config) => {
  const testPath = result.testFilePath;
  const status = result.numFailingTests > 0 || result.testExecError ?
  FAIL :
  PASS;

  const runTime = result.perfStats ?
  (result.perfStats.end - result.perfStats.start) / 1000 :
  null;

  const testDetail = [];
  if (runTime !== null && runTime > 5) {
    testDetail.push(LONG_TEST_COLOR(runTime + 's'));
  }

  if (result.memoryUsage) {
    const toMB = bytes => Math.floor(bytes / 1024 / 1024);
    testDetail.push(`${toMB(result.memoryUsage)} MB heap size`);
  }

  return (
    `${status} ${formatTestPath(config, testPath)}` + (
    testDetail.length ? ` (${testDetail.join(', ')})` : ''));

};