'use strict';











const expect = require('jest-matchers'); /**
                                          * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                          *
                                          * This source code is licensed under the BSD-style license found in the
                                          * LICENSE file in the root directory of this source tree. An additional grant
                                          * of patent rights can be found in the PATENTS file in the same directory.
                                          *
                                          * 
                                          */var _require = require('jest-snapshot');const addSerializer = _require.addSerializer,toMatchSnapshot = _require.toMatchSnapshot,toThrowErrorMatchingSnapshot = _require.toThrowErrorMatchingSnapshot;






module.exports = config => {
  global.expect = expect;
  expect.setState({
    expand: config.expand });

  expect.extend({ toMatchSnapshot, toThrowErrorMatchingSnapshot });
  expect.addSnapshotSerializer = addSerializer;

  const jasmine = global.jasmine;
  jasmine.anything = expect.anything;
  jasmine.any = expect.any;
  jasmine.objectContaining = expect.objectContaining;
  jasmine.arrayContaining = expect.arrayContaining;
  jasmine.stringMatching = expect.stringMatching;

  jasmine.addMatchers = jasmineMatchersObject => {
    const jestMatchersObject = Object.create(null);
    Object.keys(jasmineMatchersObject).forEach(name => {
      jestMatchersObject[name] = function () {
        const result = jasmineMatchersObject[name](jasmine.matchersUtil, null);
        // if there is no 'negativeCompare', both should be handled by `compare`
        const negativeCompare = result.negativeCompare || result.compare;

        return this.isNot ?
        negativeCompare.apply(null, arguments) :
        result.compare.apply(null, arguments);
      };
    });

    const expect = global.expect;
    expect.extend(jestMatchersObject);
  };
};