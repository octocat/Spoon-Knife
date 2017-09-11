'use strict';













const fs = require('fs'); /**
                           * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                           *
                           * This source code is licensed under the BSD-style license found in the
                           * LICENSE file in the root directory of this source tree. An additional grant
                           * of patent rights can be found in the PATENTS file in the same directory.
                           *
                           * 
                           */const path = require('path');const diff = require('jest-diff');var _require = require('jest-matcher-utils');const EXPECTED_COLOR = _require.EXPECTED_COLOR,ensureNoExpected = _require.ensureNoExpected,matcherHint = _require.matcherHint,RECEIVED_COLOR = _require.RECEIVED_COLOR;

const SnapshotState = require('./State');var _require2 =
require('./plugins');const addSerializer = _require2.addSerializer,getSerializers = _require2.getSerializers;var _require3 =
require('./utils');const SNAPSHOT_EXTENSION = _require3.SNAPSHOT_EXTENSION;

const fileExists = (filePath, hasteFS) =>
hasteFS.exists(filePath) || fs.existsSync(filePath);

const cleanup = (hasteFS, update) => {
  const pattern = '\\.' + SNAPSHOT_EXTENSION + '$';
  const files = hasteFS.matchFiles(pattern);
  const filesRemoved = files.
  filter(
  snapshotFile =>
  !fileExists(
  path.resolve(
  path.dirname(snapshotFile),
  '..',
  path.basename(snapshotFile, '.' + SNAPSHOT_EXTENSION)),

  hasteFS)).


  map(snapshotFile => {
    if (update === 'all') {
      fs.unlinkSync(snapshotFile);
    }
  }).length;

  return {
    filesRemoved };

};

const toMatchSnapshot = function (received, testName) {
  this.dontThrow && this.dontThrow();const

  currentTestName = this.currentTestName,isNot = this.isNot,snapshotState = this.snapshotState;

  if (isNot) {
    throw new Error('Jest: `.not` cannot be used with `.toMatchSnapshot()`.');
  }

  if (!snapshotState) {
    throw new Error('Jest: snapshot state must be initialized.');
  }

  const result = snapshotState.match(
  testName || currentTestName || '',
  received);const

  count = result.count,pass = result.pass;let
  actual = result.actual,expected = result.expected;

  let report;
  if (pass) {
    return { message: '', pass: true };
  } else if (!expected) {
    report = () =>
    `New snapshot was ${RECEIVED_COLOR('not written')}. The update flag ` +
    `must be explicitly passed to write a new snapshot.\n\n` +
    `This is likely because this test is run in a continuous integration ` +
    `(CI) environment in which snapshots are not written by default.`;
  } else {
    expected = (expected || '').trim();
    actual = (actual || '').trim();
    const diffMessage = diff(expected, actual, {
      aAnnotation: 'Snapshot',
      bAnnotation: 'Received',
      expand: snapshotState.expand });


    report = () =>
    `${RECEIVED_COLOR('Received value')} does not match ` +
    `${EXPECTED_COLOR('stored snapshot ' + count)}.\n\n` + (
    diffMessage ||
    RECEIVED_COLOR('- ' + (expected || '')) +
    '\n' +
    EXPECTED_COLOR('+ ' + actual));
  }
  // Passing the the actual and expected objects so that a custom reporter
  // could access them, for example in order to display a custom visual diff,
  // or create a different error message
  return {
    actual,
    expected,
    message: () =>
    matcherHint('.toMatchSnapshot', 'value', '') + '\n\n' + report(),
    name: 'toMatchSnapshot',
    pass: false,
    report };

};

const toThrowErrorMatchingSnapshot = function (received, expected) {
  this.dontThrow && this.dontThrow();const
  isNot = this.isNot;

  if (isNot) {
    throw new Error(
    'Jest: `.not` cannot be used with `.toThrowErrorMatchingSnapshot()`.');

  }

  ensureNoExpected(expected, '.toThrowErrorMatchingSnapshot');

  let error;

  try {
    received();
  } catch (e) {
    error = e;
  }

  if (error === undefined) {
    throw new Error(
    matcherHint('.toThrowErrorMatchingSnapshot', '() => {}', '') +
    '\n\n' +
    `Expected the function to throw an error.\n` +
    `But it didn't throw anything.`);

  }

  return toMatchSnapshot.call(this, error.message);
};

module.exports = {
  EXTENSION: SNAPSHOT_EXTENSION,
  SnapshotState,
  addSerializer,
  cleanup,
  getSerializers,
  toMatchSnapshot,
  toThrowErrorMatchingSnapshot };