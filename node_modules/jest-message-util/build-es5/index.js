'use strict'; /**
               * Copyright (c) 2014, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */




var path = require('path');
var chalk = require('chalk');
var micromatch = require('micromatch');
var slash = require('slash');










// filter for noisy stack trace lines
var JASMINE_IGNORE = /^\s+at(?:(?:.*?vendor\/|jasmine\-)|\s+jasmine\.buildExpectationResult)/;
var STACK_TRACE_IGNORE = /^\s+at.*?jest(-.*?)?(\/|\\)(build|node_modules|packages)(\/|\\)/;
var TITLE_INDENT = '  ';
var MESSAGE_INDENT = '    ';
var STACK_INDENT = '      ';
var ANCESTRY_SEPARATOR = ' \u203A ';
var TITLE_BULLET = chalk.bold('\u25CF ');
var STACK_TRACE_COLOR = chalk.dim;
var STACK_PATH_REGEXP = /\s*at.*\(?(\:\d*\:\d*|native)\)?/;
var EXEC_ERROR_MESSAGE = 'Test suite failed to run';
var ERROR_TEXT = 'Error: ';

var trim = function trim(string) {return (string || '').replace(/^\s+/, '').replace(/\s+$/, '');};

// Some errors contain not only line numbers in stack traces
// e.g. SyntaxErrors can contain snippets of code, and we don't
// want to trim those, because they may have pointers to the column/character
// which will get misaligned.
var trimPaths = function trimPaths(string) {return (
    string.match(STACK_PATH_REGEXP) ? trim(string) : string);};

// ExecError is an error thrown outside of the test suite (not inside an `it` or
// `before/after each` hooks). If it's thrown, none of the tests in the file
// are executed.
var formatExecError = function formatExecError(
testResult,
config,
options,
testPath)
{
  var error = testResult.testExecError;
  if (!error || typeof error === 'number') {
    error = new Error('Expected an Error, but "' + String(error) + '" was thrown');
    error.stack = '';
  }var _error =

  error,message = _error.message,stack = _error.stack;

  if (typeof error === 'string' || !error) {
    error || (error = 'EMPTY ERROR');
    message = '';
    stack = error;
  }

  var separated = separateMessageFromStack(stack || '');
  stack = separated.stack;

  if (separated.message.indexOf(trim(message)) !== -1) {
    // Often stack trace already contains the duplicate of the message
    message = separated.message;
  }

  message = message.split(/\n/).map(function (line) {return MESSAGE_INDENT + line;}).join('\n');
  stack = stack && !options.noStackTrace ?
  '\n' + formatStackTrace(stack, config, options, testPath) :
  '';

  if (message.match(/^\s*$/) && stack.match(/^\s*$/)) {
    // this can happen if an empty object is thrown.
    message = MESSAGE_INDENT + 'Error: No message was provided';
  }

  return (
    TITLE_INDENT +
    TITLE_BULLET +
    EXEC_ERROR_MESSAGE +
    '\n\n' +
    message +
    stack +
    '\n');

};

var removeInternalStackEntries = function removeInternalStackEntries(lines, options) {
  var pathCounter = 0;

  return lines.filter(function (line) {
    var isPath = STACK_PATH_REGEXP.test(line);
    if (!isPath) {
      return true;
    }
    if (JASMINE_IGNORE.test(line)) {
      return false;
    }

    if (++pathCounter === 1) {
      return true; // always keep the first line even if it's from Jest
    }

    return !(STACK_TRACE_IGNORE.test(line) || options.noStackTrace);
  });
};

var formatPaths = function formatPaths(
config,
options,
relativeTestPath,
line)
{
  // Extract the file path from the trace line.
  var match = line.match(/(^\s*at .*?\(?)([^()]+)(:[0-9]+:[0-9]+\)?.*$)/);
  if (!match) {
    return line;
  }

  var filePath = slash(path.relative(config.rootDir, match[2]));
  // highlight paths from the current test file
  if (
  config.testMatch &&
  config.testMatch.length &&
  micromatch(filePath, config.testMatch) ||
  filePath === relativeTestPath)
  {
    filePath = chalk.reset.cyan(filePath);
  }
  return STACK_TRACE_COLOR(match[1]) + filePath + STACK_TRACE_COLOR(match[3]);
};

var formatStackTrace = function formatStackTrace(
stack,
config,
options,
testPath)
{
  var lines = stack.split(/\n/);
  var relativeTestPath = testPath ?
  slash(path.relative(config.rootDir, testPath)) :
  null;
  lines = removeInternalStackEntries(lines, options);
  return lines.
  map(trimPaths).
  map(formatPaths.bind(null, config, options, relativeTestPath)).
  map(function (line) {return STACK_INDENT + line;}).
  join('\n');
};

var formatResultsErrors = function formatResultsErrors(
testResults,
config,
options,
testPath)
{
  var failedResults = testResults.reduce(function (errors, result) {
    result.failureMessages.forEach(function (content) {return errors.push({ content: content, result: result });});
    return errors;
  }, []);

  if (!failedResults.length) {
    return null;
  }

  return failedResults.
  map(function (_ref) {var result = _ref.result,content = _ref.content;var _separateMessageFromS =
    separateMessageFromStack(content),message = _separateMessageFromS.message,stack = _separateMessageFromS.stack;
    stack = options.noStackTrace ?
    '' :
    STACK_TRACE_COLOR(
    formatStackTrace(stack, config, options, testPath)) +
    '\n';

    message = message.
    split(/\n/).
    map(function (line) {return MESSAGE_INDENT + line;}).
    join('\n');

    var title =
    chalk.bold.red(
    TITLE_INDENT +
    TITLE_BULLET +
    result.ancestorTitles.join(ANCESTRY_SEPARATOR) + (
    result.ancestorTitles.length ? ANCESTRY_SEPARATOR : '') +
    result.title) +
    '\n';

    return title + '\n' + message + '\n' + stack;
  }).
  join('\n');
};

// jasmine and worker farm sometimes don't give us access to the actual
// Error object, so we have to regexp out the message from the stack string
// to format it.
var separateMessageFromStack = function separateMessageFromStack(content) {
  if (!content) {
    return { message: '', stack: '' };
  }

  var messageMatch = content.match(/(^(.|\n)*?(?=\n\s*at\s.*\:\d*\:\d*))/);
  var message = messageMatch ? messageMatch[0] : 'Error';
  var stack = messageMatch ? content.slice(message.length) : content;
  // If the error is a plain error instead of a SyntaxError or TypeError
  // we remove it from the message because it is generally not useful.
  if (message.startsWith(ERROR_TEXT)) {
    message = message.substr(ERROR_TEXT.length);
  }
  return { message: message, stack: stack };
};

module.exports = {
  formatExecError: formatExecError,
  formatResultsErrors: formatResultsErrors,
  formatStackTrace: formatStackTrace,
  separateMessageFromStack: separateMessageFromStack };