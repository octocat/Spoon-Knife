'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */








const fs = require('fs');var _require =
require('jest-util');const Console = _require.Console,NullConsole = _require.NullConsole,setGlobal = _require.setGlobal;var _require2 =
require('jest-config');const getTestEnvironment = _require2.getTestEnvironment;
const docblock = require('jest-docblock');

const BufferedConsole = require('./lib/BufferedConsole');
const getConsoleOutput = require('./reporters/getConsoleOutput');

function runTest(
path,
globalConfig,
config,
resolver)
{
  let testSource;

  try {
    testSource = fs.readFileSync(path, 'utf8');
  } catch (e) {
    return Promise.reject(e);
  }

  const parsedDocblock = docblock.parse(docblock.extract(testSource));
  const customEnvironment = parsedDocblock['jest-environment'];
  let testEnvironment = config.testEnvironment;

  if (customEnvironment) {
    testEnvironment = getTestEnvironment(
    Object.assign({}, config, {
      testEnvironment: customEnvironment }));


  }

  /* $FlowFixMe */
  const TestEnvironment = require(testEnvironment);
  /* $FlowFixMe */
  const testFramework = require(config.testRunner);
  /* $FlowFixMe */
  const Runtime = require(config.moduleLoader || 'jest-runtime');



  const environment = new TestEnvironment(config);
  const TestConsole = globalConfig.verbose ?
  Console :
  globalConfig.silent ? NullConsole : BufferedConsole;
  const testConsole = new TestConsole(
  globalConfig.useStderr ? process.stderr : process.stdout,
  process.stderr,
  (type, message) =>
  getConsoleOutput(
  config.rootDir,
  !!globalConfig.verbose,
  // 4 = the console call is buried 4 stack frames deep
  BufferedConsole.write([], type, message, 4)));


  const cacheFS = { [path]: testSource };
  setGlobal(environment.global, 'console', testConsole);
  const runtime = new Runtime(config, environment, resolver, cacheFS, {
    collectCoverage: globalConfig.collectCoverage,
    collectCoverageFrom: globalConfig.collectCoverageFrom,
    collectCoverageOnlyFrom: globalConfig.collectCoverageOnlyFrom,
    mapCoverage: globalConfig.mapCoverage });

  const start = Date.now();
  return testFramework(globalConfig, config, environment, runtime, path).
  then(result => {
    const testCount =
    result.numPassingTests +
    result.numFailingTests +
    result.numPendingTests;
    result.perfStats = { end: Date.now(), start };
    result.testFilePath = path;
    result.coverage = runtime.getAllCoverageInfo();
    result.sourceMaps = runtime.getSourceMapInfo();
    result.console = testConsole.getBuffer();
    result.skipped = testCount === result.numPendingTests;
    return result;
  }).
  then(
  result =>
  Promise.resolve().then(() => {
    environment.dispose();
    if (config.logHeapUsage) {
      if (global.gc) {
        global.gc();
      }
      result.memoryUsage = process.memoryUsage().heapUsed;
    }

    // Delay the resolution to allow log messages to be output.
    return new Promise(resolve => setImmediate(() => resolve(result)));
  }),
  err =>
  Promise.resolve().then(() => {
    environment.dispose();
    throw err;
  }));

}

module.exports = runTest;