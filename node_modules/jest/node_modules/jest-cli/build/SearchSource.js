'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */






const path = require('path');

const micromatch = require('micromatch');

const DependencyResolver = require('jest-resolve-dependencies');
const changedFiles = require('jest-changed-files');var _require =
require('jest-regex-util');const escapePathForRegex = _require.escapePathForRegex,replacePathSepForRegex = _require.replacePathSepForRegex;


























const git = changedFiles.git;
const hg = changedFiles.hg;

const determineSCM = path =>
Promise.all([git.isGitRepository(path), hg.isHGRepository(path)]);
const pathToRegex = p => replacePathSepForRegex(p);

const globsToMatcher = globs => {
  if (globs == null || globs.length === 0) {
    return () => true;
  }

  const matchers = globs.map(each => micromatch.matcher(each, { dot: true }));
  return path => matchers.some(each => each(path));
};

const regexToMatcher = testRegex => {
  if (!testRegex) {
    return () => true;
  }

  const regex = new RegExp(pathToRegex(testRegex));
  return path => regex.test(path);
};

const toTests = (context, tests) =>
tests.map(path => ({
  context,
  duration: undefined,
  path }));


class SearchSource {











  constructor(context, options) {const
    config = context.config;
    this._context = context;
    this._options = options || {
      skipNodeResolution: false };


    this._rootPattern = new RegExp(
    config.roots.map(dir => escapePathForRegex(dir)).join('|'));


    const ignorePattern = config.testPathIgnorePatterns;
    this._testIgnorePattern = ignorePattern.length ?
    new RegExp(ignorePattern.join('|')) :
    null;

    this._testPathCases = {
      roots: path => this._rootPattern.test(path),
      testMatch: globsToMatcher(config.testMatch),
      testPathIgnorePatterns: path =>
      !this._testIgnorePattern || !this._testIgnorePattern.test(path),
      testRegex: regexToMatcher(config.testRegex) };

  }

  _filterTestPathsWithStats(
  allPaths,
  testPathPattern)
  {
    const data = {
      stats: {},
      tests: [],
      total: allPaths.length };


    const testCases = Object.assign({}, this._testPathCases);
    if (testPathPattern) {
      const regex = new RegExp(testPathPattern, 'i');
      testCases.testPathPattern = path => regex.test(path);
    }

    const testCasesKeys = Object.keys(testCases);
    data.tests = allPaths.filter(test => {
      return testCasesKeys.reduce((flag, key) => {
        if (testCases[key](test.path)) {
          data.stats[key] = ++data.stats[key] || 1;
          return flag && true;
        }
        data.stats[key] = data.stats[key] || 0;
        return false;
      }, true);
    });

    return data;
  }

  _getAllTestPaths(testPathPattern) {
    return this._filterTestPathsWithStats(
    toTests(this._context, this._context.hasteFS.getAllFiles()),
    testPathPattern);

  }

  isTestFilePath(path) {
    return Object.keys(this._testPathCases).every(key =>
    this._testPathCases[key](path));

  }

  findMatchingTests(testPathPattern) {
    return this._getAllTestPaths(testPathPattern);
  }

  findRelatedTests(allPaths) {
    const dependencyResolver = new DependencyResolver(
    this._context.resolver,
    this._context.hasteFS);

    return {
      tests: toTests(
      this._context,
      dependencyResolver.resolveInverse(
      allPaths,
      this.isTestFilePath.bind(this),
      {
        skipNodeResolution: this._options.skipNodeResolution })) };




  }

  findRelatedTestsFromPattern(paths) {
    if (Array.isArray(paths) && paths.length) {
      const resolvedPaths = paths.map(p => path.resolve(process.cwd(), p));
      return this.findRelatedTests(new Set(resolvedPaths));
    }
    return { tests: [] };
  }

  findChangedTests(options) {
    return Promise.all(
    this._context.config.roots.map(determineSCM)).
    then(repos => {
      if (!repos.every((_ref) => {var _ref2 = _slicedToArray(_ref, 2);let gitRepo = _ref2[0],hgRepo = _ref2[1];return gitRepo || hgRepo;})) {
        return {
          noSCM: true,
          tests: [] };

      }
      return Promise.all(
      repos.map((_ref3) => {var _ref4 = _slicedToArray(_ref3, 2);let gitRepo = _ref4[0],hgRepo = _ref4[1];
        if (gitRepo) {
          return git.findChangedFiles(gitRepo, options);
        }
        if (hgRepo) {
          return hg.findChangedFiles(hgRepo, options);
        }
        return [];
      })).
      then(changedPathSets =>
      this.findRelatedTests(
      new Set(Array.prototype.concat.apply([], changedPathSets))));


    });
  }

  getTestPaths(pattern) {
    if (pattern.onlyChanged) {
      return this.findChangedTests({ lastCommit: pattern.lastCommit });
    } else if (pattern.findRelatedTests && pattern.paths) {
      return Promise.resolve(this.findRelatedTestsFromPattern(pattern.paths));
    } else if (pattern.testPathPattern != null) {
      return Promise.resolve(this.findMatchingTests(pattern.testPathPattern));
    } else {
      return Promise.resolve({ tests: [] });
    }
  }}


module.exports = SearchSource;