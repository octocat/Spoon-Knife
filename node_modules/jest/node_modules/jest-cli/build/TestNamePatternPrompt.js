'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */




const scroll = require('./lib/scrollList');var _require =
require('./lib/terminalUtils');const getTerminalWidth = _require.getTerminalWidth;
const Prompt = require('./lib/Prompt');
const formatTestNameByPattern = require('./lib/formatTestNameByPattern');var _require2 =








require('./lib/patternModeHelpers');const formatTypeaheadSelection = _require2.formatTypeaheadSelection,printMore = _require2.printMore,printPatternCaret = _require2.printPatternCaret,printPatternMatches = _require2.printPatternMatches,printRestoredPatternCaret = _require2.printRestoredPatternCaret,printStartTyping = _require2.printStartTyping,printTypeaheadItem = _require2.printTypeaheadItem;
const PatternPrompt = require('./PatternPrompt');

module.exports = class TestNamePatternPrompt extends PatternPrompt {


  constructor(pipe, prompt) {
    super(pipe, prompt);
    this._entityName = 'tests';
    this._cachedTestResults = [];
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
      printPatternMatches(
      total,
      'test',
      pipe,
      ` from ${require('chalk').yellow('cached')} test suites`);


      const width = getTerminalWidth();var _scroll =
      scroll(total, options);const start = _scroll.start,end = _scroll.end,index = _scroll.index;

      prompt.setTypeaheadLength(total);

      matchedTests.
      slice(start, end).
      map(name => formatTestNameByPattern(name, pattern, width - 4)).
      map((item, i) => formatTypeaheadSelection(item, i, index, prompt)).
      forEach(item => printTypeaheadItem(item, pipe));

      if (total > end) {
        printMore('test', pipe, total - end);
      }
    } else {
      printStartTyping('test name', pipe);
    }

    printRestoredPatternCaret(pattern, this._currentUsageRows, pipe);
  }

  _getMatchedTests(pattern) {
    let regex;

    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {
      return [];
    }

    const matchedTests = [];

    this._cachedTestResults.forEach((_ref) => {let testResults = _ref.testResults;return (
        testResults.forEach((_ref2) => {let title = _ref2.title;
          if (regex.test(title)) {
            matchedTests.push(title);
          }
        }));});


    return matchedTests;
  }

  updateCachedTestResults() {let testResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    this._cachedTestResults = testResults;
  }};