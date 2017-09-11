'use strict';











const fs = require('fs'); /**
                           * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                           *
                           * This source code is licensed under the BSD-style license found in the
                           * LICENSE file in the root directory of this source tree. An additional grant
                           * of patent rights can be found in the PATENTS file in the same directory.
                           *
                           * 
                           */const path = require('path');const chalk = require('chalk');var _require = require('jest-util');const createDirectory = _require.createDirectory;const prettyFormat = require('pretty-format');const naturalCompare = require('natural-compare');var _require2 = require('./plugins');const getSerializers = _require2.getSerializers;const SNAPSHOT_EXTENSION = 'snap';
const SNAPSHOT_VERSION = '1';
const SNAPSHOT_VERSION_REGEXP = /^\/\/ Jest Snapshot v(.+),/;
const SNAPSHOT_GUIDE_LINK = 'https://goo.gl/fbAQLP';
const SNAPSHOT_VERSION_WARNING = chalk.yellow(
`${chalk.bold('Warning')}: Before you upgrade snapshots, ` +
`we recommend that you revert any local changes to tests or other code, ` +
`to ensure that you do not store invalid state.`);


const writeSnapshotVersion = () =>
`// Jest Snapshot v${SNAPSHOT_VERSION}, ${SNAPSHOT_GUIDE_LINK}`;

const validateSnapshotVersion = snapshotContents => {
  const versionTest = SNAPSHOT_VERSION_REGEXP.exec(snapshotContents);
  const version = versionTest && versionTest[1];

  if (!version) {
    return new Error(
    chalk.red(
    `${chalk.bold('Outdated snapshot')}: No snapshot header found. ` +
    `Jest 19 introduced versioned snapshots to ensure all developers ` +
    `on a project are using the same version of Jest. ` +
    `Please update all snapshots during this upgrade of Jest.\n\n`) +
    SNAPSHOT_VERSION_WARNING);

  }

  if (version < SNAPSHOT_VERSION) {
    return new Error(
    chalk.red(
    `${chalk.red.bold('Outdated snapshot')}: The version of the snapshot ` +
    `file associated with this test is outdated. The snapshot file ` +
    `version ensures that all developers on a project are using ` +
    `the same version of Jest. ` +
    `Please update all snapshots during this upgrade of Jest.\n\n`) +

    `Expected: v${SNAPSHOT_VERSION}\n` +
    `Received: v${version}\n\n` +
    SNAPSHOT_VERSION_WARNING);

  }

  if (version > SNAPSHOT_VERSION) {
    return new Error(
    chalk.red(
    `${chalk.red.bold('Outdated Jest version')}: The version of this ` +
    `snapshot file indicates that this project is meant to be used ` +
    `with a newer version of Jest. The snapshot file version ensures ` +
    `that all developers on a project are using the same version of ` +
    `Jest. Please update your version of Jest and re-run the tests.\n\n`) +

    `Expected: v${SNAPSHOT_VERSION}\n` +
    `Received: v${version}`);

  }

  return null;
};

const testNameToKey = (testName, count) =>
testName + ' ' + count;

const keyToTestName = key => {
  if (!/ \d+$/.test(key)) {
    throw new Error('Snapshot keys must end with a number.');
  }

  return key.replace(/ \d+$/, '');
};

const getSnapshotPath = testPath =>
path.join(
path.join(path.dirname(testPath), '__snapshots__'),
path.basename(testPath) + '.' + SNAPSHOT_EXTENSION);


const getSnapshotData = (snapshotPath, update) => {
  const data = Object.create(null);
  let snapshotContents = '';
  let dirty = false;

  if (fs.existsSync(snapshotPath)) {
    try {
      snapshotContents = fs.readFileSync(snapshotPath, 'utf8');
      // eslint-disable-next-line no-new-func
      const populate = new Function('exports', snapshotContents);
      populate(data);
    } catch (e) {}
  }

  const validationResult = validateSnapshotVersion(snapshotContents);
  const isInvalid = snapshotContents && validationResult;

  if (update === 'none' && isInvalid) {
    throw validationResult;
  }

  if ((update === 'all' || update === 'new') && isInvalid) {
    dirty = true;
  }

  return { data, dirty };
};

// Extra line breaks at the beginning and at the end of the snapshot are useful
// to make the content of the snapshot easier to read
const addExtraLineBreaks = string =>
string.includes('\n') ? `\n${string}\n` : string;

const serialize = data => {
  return addExtraLineBreaks(
  normalizeNewlines(
  prettyFormat(data, {
    escapeRegex: true,
    plugins: getSerializers(),
    printFunctionName: false })));



};

// unescape double quotes
const unescape = data => data.replace(/\\(")/g, '$1');

const printBacktickString = str => {
  return '`' + str.replace(/`|\\|\${/g, '\\$&') + '`';
};

const ensureDirectoryExists = filePath => {
  try {
    createDirectory(path.join(path.dirname(filePath)));
  } catch (e) {}
};

const normalizeNewlines = string => string.replace(/\r\n|\r/g, '\n');

const saveSnapshotFile = (
snapshotData,
snapshotPath) =>
{
  const snapshots = Object.keys(snapshotData).
  sort(naturalCompare).
  map(
  key =>
  'exports[' +
  printBacktickString(key) +
  '] = ' +
  printBacktickString(normalizeNewlines(snapshotData[key])) +
  ';');


  ensureDirectoryExists(snapshotPath);
  fs.writeFileSync(
  snapshotPath,
  writeSnapshotVersion() + '\n\n' + snapshots.join('\n\n') + '\n');

};

module.exports = {
  SNAPSHOT_EXTENSION,
  SNAPSHOT_GUIDE_LINK,
  SNAPSHOT_VERSION,
  SNAPSHOT_VERSION_WARNING,
  ensureDirectoryExists,
  getSnapshotData,
  getSnapshotPath,
  keyToTestName,
  saveSnapshotFile,
  serialize,
  testNameToKey,
  unescape };