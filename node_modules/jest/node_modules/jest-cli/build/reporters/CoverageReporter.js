'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}var _require =























require('jest-util');const clearLine = _require.clearLine; /**
                                                           * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                           *
                                                           * This source code is licensed under the BSD-style license found in the
                                                           * LICENSE file in the root directory of this source tree. An additional grant
                                                           * of patent rights can be found in the PATENTS file in the same directory.
                                                           *
                                                           * 
                                                           */var _require2 = require('istanbul-api');const createReporter = _require2.createReporter;const chalk = require('chalk');const isCI = require('is-ci');const istanbulCoverage = require('istanbul-lib-coverage');const libSourceMaps = require('istanbul-lib-source-maps');const pify = require('pify');const workerFarm = require('worker-farm');
const BaseReporter = require('./BaseReporter');

const FAIL_COLOR = chalk.bold.red;
const RUNNING_TEST_COLOR = chalk.bold.dim;

const isInteractive = process.stdout.isTTY && !isCI;

class CoverageReporter extends BaseReporter {





  constructor(globalConfig, options) {
    super(globalConfig);
    this._coverageMap = istanbulCoverage.createCoverageMap({});
    this._globalConfig = globalConfig;
    this._sourceMapStore = libSourceMaps.createSourceMapStore();
    this._maxWorkers = options.maxWorkers;
  }

  onTestResult(
  test,
  testResult,
  aggregatedResults)
  {
    if (testResult.coverage) {
      this._coverageMap.merge(testResult.coverage);
      // Remove coverage data to free up some memory.
      delete testResult.coverage;

      Object.keys(testResult.sourceMaps).forEach(sourcePath => {
        this._sourceMapStore.registerURL(
        sourcePath,
        testResult.sourceMaps[sourcePath]);

      });
    }
  }

  onRunComplete(
  contexts,
  aggregatedResults)
  {var _this = this;return _asyncToGenerator(function* () {
      yield _this._addUntestedFiles(_this._globalConfig, contexts);
      let map = _this._coverageMap;
      let sourceFinder;
      if (_this._globalConfig.mapCoverage) {var _sourceMapStore$trans =
        _this._sourceMapStore.transformCoverage(map);map = _sourceMapStore$trans.map;sourceFinder = _sourceMapStore$trans.sourceFinder;
      }

      const reporter = createReporter();
      try {
        if (_this._globalConfig.coverageDirectory) {
          reporter.dir = _this._globalConfig.coverageDirectory;
        }

        let coverageReporters = _this._globalConfig.coverageReporters || [];
        if (
        !_this._globalConfig.useStderr &&
        coverageReporters.length &&
        coverageReporters.indexOf('text') === -1)
        {
          coverageReporters = coverageReporters.concat(['text-summary']);
        }

        reporter.addAll(coverageReporters);
        reporter.write(map, sourceFinder && { sourceFinder });
        aggregatedResults.coverageMap = map;
      } catch (e) {
        console.error(
        chalk.red(`
        Failed to write coverage reports:
        ERROR: ${e.toString()}
        STACK: ${e.stack}
      `));

      }

      _this._checkThreshold(_this._globalConfig, map);})();
  }

  _addUntestedFiles(globalConfig, contexts) {
    const files = [];
    contexts.forEach(context => {
      const config = context.config;
      if (
      globalConfig.collectCoverageFrom &&
      globalConfig.collectCoverageFrom.length)
      {
        context.hasteFS.
        matchFilesWithGlob(globalConfig.collectCoverageFrom, config.rootDir).
        forEach(filePath =>
        files.push({
          config,
          path: filePath }));


      }
    });
    if (!files.length) {
      return Promise.resolve();
    }

    if (isInteractive) {
      process.stderr.write(
      RUNNING_TEST_COLOR('Running coverage on untested files...'));

    }

    let worker;
    let farm;
    if (this._maxWorkers <= 1) {
      worker = pify(require('./CoverageWorker'));
    } else {
      farm = workerFarm(
      {
        autoStart: true,
        maxConcurrentCallsPerWorker: 1,
        maxConcurrentWorkers: this._maxWorkers,
        maxRetries: 2 },

      require.resolve('./CoverageWorker'));

      worker = pify(farm);
    }
    const instrumentation = [];
    files.forEach(fileObj => {
      const filename = fileObj.path;
      const config = fileObj.config;
      if (!this._coverageMap.data[filename]) {
        const promise = worker({
          config,
          globalConfig,
          path: filename }).

        then(result => {
          if (result) {
            this._coverageMap.addFileCoverage(result.coverage);
            if (result.sourceMapPath) {
              this._sourceMapStore.registerURL(
              filename,
              result.sourceMapPath);

            }
          }
        }).
        catch(error => {
          console.error(chalk.red(error.message));
        });
        instrumentation.push(promise);
      }
    });

    const cleanup = () => {
      if (isInteractive) {
        clearLine(process.stderr);
      }
      if (farm) {
        workerFarm.end(farm);
      }
    };

    return Promise.all(instrumentation).then(cleanup).catch(cleanup);
  }

  _checkThreshold(globalConfig, map) {
    if (globalConfig.coverageThreshold) {
      const results = map.getCoverageSummary().toJSON();

      function check(name, thresholds, actuals) {
        return [
        'statements',
        'branches',
        'lines',
        'functions'].
        reduce((errors, key) => {
          const actual = actuals[key].pct;
          const actualUncovered = actuals[key].total - actuals[key].covered;
          const threshold = thresholds[key];

          if (threshold != null) {
            if (threshold < 0) {
              if (threshold * -1 < actualUncovered) {
                errors.push(
                `Jest: Uncovered count for ${key} (${actualUncovered})` +
                `exceeds ${name} threshold (${-1 * threshold})`);

              }
            } else if (actual < threshold) {
              errors.push(
              `Jest: Coverage for ${key} (${actual}` +
              `%) does not meet ${name} threshold (${threshold}%)`);

            }
          }
          return errors;
        }, []);
      }
      const errors = check(
      'global',
      globalConfig.coverageThreshold.global,
      results);


      if (errors.length > 0) {
        this.log(`${FAIL_COLOR(errors.join('\n'))}`);
        this._setError(new Error(errors.join('\n')));
      }
    }
  }

  // Only exposed for the internal runner. Should not be used
  getCoverageMap() {
    return this._coverageMap;
  }}


module.exports = CoverageReporter;