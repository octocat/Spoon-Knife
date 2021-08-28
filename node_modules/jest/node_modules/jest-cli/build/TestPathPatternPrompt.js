'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */







const chalk = require('chalk'); // eslint-disable-next-line import/default
const stringLength = require('string-length');
const scroll = require('./lib/scrollList');var _require =
require('./lib/terminalUtils');const getTerminalWidth = _require.getTerminalWidth;
const highlight = require('./lib/highlight');var _require2 =
require('./reporters/utils');const trimAndFormatPath = _require2.trimAndFormatPath;
const Prompt = require('./lib/Prompt');var _require3 =








require('./lib/patternModeHelpers');const formatTypeaheadSelection = _require3.formatTypeaheadSelection,printMore = _require3.printMore,printPatternCaret = _require3.printPatternCaret,printPatternMatches = _require3.printPatternMatches,printRestoredPatternCaret = _require3.printRestoredPatternCaret,printStartTyping = _require3.printStartTyping,printTypeaheadItem = _require3.printTypeaheadItem;
const PatternPrompt = require('./PatternPrompt');






module.exports = class TestPathPatternPrompt extends PatternPrompt {


  constructor(pipe, prompt) {
    super(pipe, prompt);
    this._entityName = 'filenames';
  }

  _onChange(pattern, options) {
    super._onChange(pattern, options);
    this._printTypeahead(pattern, options);
  }

  _printTypeahead(pattern, options) {
    const matchedTests = this._getMatchedTests(pattern);
    const total = matchedTests.length;
    const pipe = this._pipe;
    const prompt = this._prompt;

    printPatternCaret(pattern, pipe);

    if (pattern) {
      printPatternMatches(total, 'file', pipe);

      const prefix = `  ${chalk.dim('\u203A')} `;
      const padding = stringLength(prefix) + 2;
      const width = getTerminalWidth();var _scroll =
      scroll(total, options);const start = _scroll.start,end = _scroll.end,index = _scroll.index;

      prompt.setTypeaheadLength(total);

      matchedTests.
      slice(start, end).
      map((_ref) => {let path = _ref.path,context = _ref.context;
        const filePath = trimAndFormatPath(
        padding,
        context.config,
        path,
        width);

        return highlight(path, filePath, pattern, context.config.rootDir);
      }).
      map((item, i) => formatTypeaheadSelection(item, i, index, prompt)).
      forEach(item => printTypeaheadItem(item, pipe));

      if (total > end) {
        printMore('file', pipe, total - end);
      }
    } else {
      printStartTyping('filename', pipe);
    }

    printRestoredPatternCaret(pattern, this._currentUsageRows, pipe);
  }

  _getMatchedTests(pattern) {
    let regex;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {}

    let tests = [];
    if (regex) {
      this._searchSources.forEach((_ref2) => {let searchSource = _ref2.searchSource,context = _ref2.context;
        tests = tests.concat(searchSource.findMatchingTests(pattern).tests);
      });
    }

    return tests;
  }

  updateSearchSources(searchSources) {
    this._searchSources = searchSources;
  }};