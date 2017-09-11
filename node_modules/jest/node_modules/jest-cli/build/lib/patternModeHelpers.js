/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

const chalk = require('chalk');
const ansiEscapes = require('ansi-escapes');
const stringLength = require('string-length');
const Prompt = require('./Prompt');

const pluralize = (count, text) =>
count === 1 ? text : text + 's';

const printPatternMatches = function (
count,
entity,
pipe)

{let extraText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  const pluralized = pluralize(count, entity);
  const result = count ?
  `\n\n Pattern matches ${count} ${pluralized}` :
  `\n\n Pattern matches no ${pluralized}`;

  pipe.write(result + extraText);
};

const printPatternCaret = (
pattern,
pipe) =>
{
  const inputText = `${chalk.dim(' pattern \u203A')} ${pattern}`;

  pipe.write(ansiEscapes.eraseDown);
  pipe.write(inputText);
  pipe.write(ansiEscapes.cursorSavePosition);
};

const printRestoredPatternCaret = (
pattern,
currentUsageRows,
pipe) =>
{
  const inputText = `${chalk.dim(' pattern \u203A')} ${pattern}`;

  pipe.write(
  ansiEscapes.cursorTo(stringLength(inputText), currentUsageRows - 1));

  pipe.write(ansiEscapes.cursorRestorePosition);
};

const printStartTyping = (
entity,
pipe) =>
{
  pipe.write(
  `\n\n ${chalk.italic.yellow(`Start typing to filter by a ${entity} regex pattern.`)}`);

};

const printMore = (
entity,
pipe,
more) =>
{
  pipe.write(
  `\n   ${chalk.dim(`...and ${more} more ${pluralize(more, entity)}`)}`);

};

const printTypeaheadItem = (
item,
pipe) =>
pipe.write(`\n ${chalk.dim('\u203A')} ${item}`);

const formatTypeaheadSelection = (
item,
index,
activeIndex,
prompt) =>
{
  if (index === activeIndex) {
    prompt.setTypheadheadSelection(chalk.stripColor(item));
    return chalk.black.bgYellow(chalk.stripColor(item));
  }
  return item;
};

module.exports = {
  formatTypeaheadSelection,
  printMore,
  printPatternCaret,
  printPatternMatches,
  printRestoredPatternCaret,
  printStartTyping,
  printTypeaheadItem };