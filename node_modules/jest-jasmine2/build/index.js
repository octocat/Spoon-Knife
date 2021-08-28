'use strict';















const path = require('path'); /**
                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                               *
                               * This source code is licensed under the BSD-style license found in the
                               * LICENSE file in the root directory of this source tree. An additional grant
                               * of patent rights can be found in the PATENTS file in the same directory.
                               *
                               * 
                               */const JasmineReporter = require('./reporter');const jasmineAsync = require('./jasmine-async');const JASMINE = require.resolve('./jasmine/jasmine-light.js');function jasmine2(
globalConfig,
config,
environment,
runtime,
testPath)
{
  const reporter = new JasmineReporter(
  globalConfig,
  config,
  environment,
  testPath);

  const jasmineFactory = runtime.requireInternalModule(JASMINE);
  const jasmine = jasmineFactory.create();

  const env = jasmine.getEnv();
  const jasmineInterface = jasmineFactory.interface(jasmine, env);
  Object.assign(environment.global, jasmineInterface);
  env.addReporter(jasmineInterface.jsApiReporter);

  jasmineAsync.install(environment.global);

  environment.global.test = environment.global.it;
  environment.global.it.only = environment.global.fit;
  environment.global.it.skip = environment.global.xit;
  environment.global.xtest = environment.global.xit;
  environment.global.describe.skip = environment.global.xdescribe;
  environment.global.describe.only = environment.global.fdescribe;

  env.beforeEach(() => {
    if (config.resetModules) {
      runtime.resetModules();
    }

    if (config.clearMocks) {
      runtime.clearAllMocks();
    }

    if (config.resetMocks) {
      runtime.resetAllMocks();
    }

    if (config.timers === 'fake') {
      environment.fakeTimers.useFakeTimers();
    }
  });

  env.addReporter(reporter);

  runtime.requireInternalModule(path.resolve(__dirname, './jest-expect.js'))({
    expand: globalConfig.expand });


  const snapshotState = runtime.requireInternalModule(
  path.resolve(__dirname, './setup-jest-globals.js'))(
  {
    config,
    globalConfig,
    localRequire: runtime.requireModule.bind(runtime),
    testPath });


  if (config.setupTestFrameworkScriptFile) {
    runtime.requireModule(config.setupTestFrameworkScriptFile);
  }

  if (globalConfig.testNamePattern) {
    const testNameRegex = new RegExp(globalConfig.testNamePattern, 'i');
    env.specFilter = spec => testNameRegex.test(spec.getFullName());
  }

  runtime.requireModule(testPath);
  env.execute();
  return reporter.
  getResults().
  then(results => addSnapshotData(results, snapshotState));
}

const addSnapshotData = (results, snapshotState) => {
  results.testResults.forEach((_ref) => {let fullName = _ref.fullName,status = _ref.status;
    if (status === 'pending' || status === 'failed') {
      // if test is skipped or failed, we don't want to mark
      // its snapshots as obsolete.
      snapshotState.markSnapshotsAsCheckedForTest(fullName);
    }
  });

  const uncheckedCount = snapshotState.getUncheckedCount();
  if (uncheckedCount) {
    snapshotState.removeUncheckedKeys();
  }

  const status = snapshotState.save();
  results.snapshot.fileDeleted = status.deleted;
  results.snapshot.added = snapshotState.added;
  results.snapshot.matched = snapshotState.matched;
  results.snapshot.unmatched = snapshotState.unmatched;
  results.snapshot.updated = snapshotState.updated;
  results.snapshot.unchecked = !status.deleted ? uncheckedCount : 0;
  return results;
};

module.exports = jasmine2;