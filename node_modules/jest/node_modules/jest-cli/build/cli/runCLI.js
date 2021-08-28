'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}













const Runtime = require('jest-runtime'); /**
                                          * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                          *
                                          * This source code is licensed under the BSD-style license found in the
                                          * LICENSE file in the root directory of this source tree. An additional grant
                                          * of patent rights can be found in the PATENTS file in the same directory.
                                          *
                                          * 
                                          */var _require = require('jest-util');const Console = _require.Console,clearLine = _require.clearLine;var _require2 = require('jest-util');const createDirectory = _require2.createDirectory;var _require3 = require('jest-config');const readConfig = _require3.readConfig;const chalk = require('chalk');const createContext = require('../lib/createContext');const getMaxWorkers = require('../lib/getMaxWorkers');const handleDeprecationWarnings = require('../lib/handleDeprecationWarnings');
const logDebugMessages = require('../lib/logDebugMessages');
const preRunMessage = require('../preRunMessage');
const runJest = require('../runJest');
const TestWatcher = require('../TestWatcher');
const watch = require('../watch');

const VERSION = require('../../package.json').version;

module.exports = (() => {var _ref = _asyncToGenerator(function* (
  argv,
  projects,
  onComplete)
  {
    const realFs = require('fs');
    const fs = require('graceful-fs');
    fs.gracefulify(realFs);

    const pipe = argv.json ? process.stderr : process.stdout;
    if (argv.version) {
      pipe.write(`v${VERSION}\n`);
      onComplete && onComplete();
      return;
    }

    const _run = (() => {var _ref2 = _asyncToGenerator(function* (globalConfig, configs) {
        const hasteMapInstances = Array(configs.length);
        const contexts = yield Promise.all(
        configs.map((() => {var _ref4 = _asyncToGenerator(function* (_ref3, index) {let config = _ref3.config;
            createDirectory(config.cacheDirectory);
            const hasteMapInstance = Runtime.createHasteMap(config, {
              console: new Console(pipe, pipe),
              maxWorkers: getMaxWorkers(argv),
              resetCache: !config.cache,
              watch: globalConfig.watch,
              watchman: globalConfig.watchman });

            hasteMapInstances[index] = hasteMapInstance;
            return createContext(config, (yield hasteMapInstance.build()));
          });return function (_x6, _x7) {return _ref4.apply(this, arguments);};})()));


        if (argv.watch || argv.watchAll) {
          if (configs.some(function (_ref5) {let hasDeprecationWarnings = _ref5.hasDeprecationWarnings;return hasDeprecationWarnings;})) {
            try {
              yield handleDeprecationWarnings(pipe, process.stdin);
              return watch(globalConfig, contexts, argv, pipe, hasteMapInstances);
            } catch (e) {
              process.exit(0);
            }
          }

          return watch(globalConfig, contexts, argv, pipe, hasteMapInstances);
        } else {
          const startRun = function () {
            if (!argv.listTests) {
              preRunMessage.print(pipe);
            }
            runJest(
            globalConfig,
            contexts,
            argv,
            pipe,
            new TestWatcher({ isWatchMode: false }),
            startRun,
            onComplete);

          };
          return startRun();
        }
      });return function _run(_x4, _x5) {return _ref2.apply(this, arguments);};})();

    try {
      let globalConfig;
      let hasDeprecationWarnings;
      let configs = [];
      let config;
      if (projects.length === 1) {var _readConfig =
        readConfig(
        argv,
        projects[0]);config = _readConfig.config;globalConfig = _readConfig.globalConfig;hasDeprecationWarnings = _readConfig.hasDeprecationWarnings;

        configs = [{ config, globalConfig, hasDeprecationWarnings }];
        if (globalConfig.projects && globalConfig.projects.length) {
          projects = globalConfig.projects;
        }
      }

      if (projects.length > 1) {
        configs = projects.map(function (root) {return readConfig(argv, root);});
        // If no config was passed initially, use the one from the first project
        if (!globalConfig && !config) {
          globalConfig = configs[0].globalConfig;
          config = configs[0].config;
        }
      }

      if (!config || !globalConfig || !configs.length) {
        throw new Error('jest: No configuration found for any project.');
      }

      if (argv.debug || argv.showConfig) {
        logDebugMessages(globalConfig, config, pipe);
      }

      if (argv.showConfig) {
        process.exit(0);
      }

      yield _run(globalConfig, configs);
    } catch (error) {
      clearLine(process.stderr);
      clearLine(process.stdout);
      console.error(chalk.red(error.stack));
      process.exit(1);
    }
  });return function (_x, _x2, _x3) {return _ref.apply(this, arguments);};})();