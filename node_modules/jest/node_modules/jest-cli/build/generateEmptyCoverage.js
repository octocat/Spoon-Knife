'use strict';











const IstanbulInstrument = require('istanbul-lib-instrument'); /**
                                                                * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                *
                                                                * This source code is licensed under the BSD-style license found in the
                                                                * LICENSE file in the root directory of this source tree. An additional grant
                                                                * of patent rights can be found in the PATENTS file in the same directory.
                                                                *
                                                                * 
                                                                */var _require = require('jest-runtime');const ScriptTransformer = _require.ScriptTransformer,shouldInstrument = _require.shouldInstrument;module.exports = function (source, filename, globalConfig, config)
{
  const coverageOptions = {
    collectCoverage: globalConfig.collectCoverage,
    collectCoverageFrom: globalConfig.collectCoverageFrom,
    collectCoverageOnlyFrom: globalConfig.collectCoverageOnlyFrom,
    mapCoverage: globalConfig.mapCoverage };

  if (shouldInstrument(filename, coverageOptions, config)) {
    // Transform file without instrumentation first, to make sure produced
    // source code is ES6 (no flowtypes etc.) and can be instrumented
    const transformResult = new ScriptTransformer(config).transformSource(
    filename,
    source,
    false,
    globalConfig.mapCoverage);

    const instrumenter = IstanbulInstrument.createInstrumenter();
    instrumenter.instrumentSync(transformResult.code, filename);
    return {
      coverage: instrumenter.fileCoverage,
      sourceMapPath: transformResult.sourceMapPath };

  } else {
    return null;
  }
};