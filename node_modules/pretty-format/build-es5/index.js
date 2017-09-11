'use strict';var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _getOwnPropertySymbols = require('babel-runtime/core-js/object/get-own-property-symbols');var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);var _symbol = require('babel-runtime/core-js/symbol');var _symbol2 = _interopRequireDefault(_symbol);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

















var style = require('ansi-styles'); /**
                                     * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                     *
                                     * This source code is licensed under the BSD-style license found in the
                                     * LICENSE file in the root directory of this source tree. An additional grant
                                     * of patent rights can be found in the PATENTS file in the same directory.
                                     *
                                     * 
                                     */















var toString = Object.prototype.toString;
var toISOString = Date.prototype.toISOString;
var errorToString = Error.prototype.toString;
var regExpToString = RegExp.prototype.toString;
var symbolToString = _symbol2.default.prototype.toString;

var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
var NEWLINE_REGEXP = /\n/gi;

var getSymbols = _getOwnPropertySymbols2.default || function (obj) {return [];};

function isToStringedArrayType(toStringed) {
  return (
    toStringed === '[object Array]' ||
    toStringed === '[object ArrayBuffer]' ||
    toStringed === '[object DataView]' ||
    toStringed === '[object Float32Array]' ||
    toStringed === '[object Float64Array]' ||
    toStringed === '[object Int8Array]' ||
    toStringed === '[object Int16Array]' ||
    toStringed === '[object Int32Array]' ||
    toStringed === '[object Uint8Array]' ||
    toStringed === '[object Uint8ClampedArray]' ||
    toStringed === '[object Uint16Array]' ||
    toStringed === '[object Uint32Array]');

}

function printNumber(val) {
  if (val != +val) {
    return 'NaN';
  }
  var isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : '' + val;
}

function printFunction(val, printFunctionName) {
  if (!printFunctionName) {
    return '[Function]';
  } else if (val.name === '') {
    return '[Function anonymous]';
  } else {
    return '[Function ' + val.name + ']';
  }
}

function printSymbol(val) {
  return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
}

function printError(val) {
  return '[' + errorToString.call(val) + ']';
}

function printBasicValue(
val,
printFunctionName,
escapeRegex)
{
  if (val === true || val === false) {
    return '' + val;
  }
  if (val === undefined) {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }

  var typeOf = typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val);

  if (typeOf === 'number') {
    return printNumber(val);
  }
  if (typeOf === 'string') {
    return '"' + val.replace(/"|\\/g, '\\$&') + '"';
  }
  if (typeOf === 'function') {
    return printFunction(val, printFunctionName);
  }
  if (typeOf === 'symbol') {
    return printSymbol(val);
  }

  var toStringed = toString.call(val);

  if (toStringed === '[object WeakMap]') {
    return 'WeakMap {}';
  }
  if (toStringed === '[object WeakSet]') {
    return 'WeakSet {}';
  }
  if (
  toStringed === '[object Function]' ||
  toStringed === '[object GeneratorFunction]')
  {
    return printFunction(val, printFunctionName);
  }
  if (toStringed === '[object Symbol]') {
    return printSymbol(val);
  }
  if (toStringed === '[object Date]') {
    return toISOString.call(val);
  }
  if (toStringed === '[object Error]') {
    return printError(val);
  }
  if (toStringed === '[object RegExp]') {
    if (escapeRegex) {
      // https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
      return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    return regExpToString.call(val);
  }
  if (toStringed === '[object Arguments]' && val.length === 0) {
    return 'Arguments []';
  }
  if (isToStringedArrayType(toStringed) && val.length === 0) {
    return val.constructor.name + ' []';
  }

  if (val instanceof Error) {
    return printError(val);
  }

  return null;
}

function printList(
list,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  var body = '';

  if (list.length) {
    body += edgeSpacing;

    var innerIndent = prevIndent + indent;

    for (var i = 0; i < list.length; i++) {
      body +=
      innerIndent +
      print(
      list[i],
      indent,
      innerIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors);


      if (i < list.length - 1) {
        body += ',' + spacing;
      }
    }

    body += (min ? '' : ',') + edgeSpacing + prevIndent;
  }

  return '[' + body + ']';
}

function printArguments(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  return (
    (min ? '' : 'Arguments ') +
    printList(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors));


}

function printArray(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  return (
    (min ? '' : val.constructor.name + ' ') +
    printList(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors));


}

function printMap(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  var result = 'Map {';
  var iterator = val.entries();
  var current = iterator.next();

  if (!current.done) {
    result += edgeSpacing;

    var innerIndent = prevIndent + indent;

    while (!current.done) {
      var key = print(
      current.value[0],
      indent,
      innerIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors);

      var _value = print(
      current.value[1],
      indent,
      innerIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors);


      result += innerIndent + key + ' => ' + _value;

      current = iterator.next();

      if (!current.done) {
        result += ',' + spacing;
      }
    }

    result += (min ? '' : ',') + edgeSpacing + prevIndent;
  }

  return result + '}';
}

function printObject(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  var constructor = min ?
  '' :
  val.constructor ? val.constructor.name + ' ' : 'Object ';
  var result = constructor + '{';
  var keys = (0, _keys2.default)(val).sort();
  var symbols = getSymbols(val);

  if (symbols.length) {
    keys = keys.
    filter(
    function (key) {return (
        // $FlowFixMe string literal `symbol`. This value is not a valid `typeof` return value
        !((typeof key === 'undefined' ? 'undefined' : (0, _typeof3.default)(key)) === 'symbol' ||
        toString.call(key) === '[object Symbol]'));}).

    concat(symbols);
  }

  if (keys.length) {
    result += edgeSpacing;

    var innerIndent = prevIndent + indent;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var name = print(
      key,
      indent,
      innerIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors);

      var _value2 = print(
      val[key],
      indent,
      innerIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors);


      result += innerIndent + name + ': ' + _value2;

      if (i < keys.length - 1) {
        result += ',' + spacing;
      }
    }

    result += (min ? '' : ',') + edgeSpacing + prevIndent;
  }

  return result + '}';
}

function printSet(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  var result = 'Set {';
  var iterator = val.entries();
  var current = iterator.next();

  if (!current.done) {
    result += edgeSpacing;

    var innerIndent = prevIndent + indent;

    while (!current.done) {
      result +=
      innerIndent +
      print(
      current.value[1],
      indent,
      innerIndent,
      spacing,
      edgeSpacing,
      refs,
      maxDepth,
      currentDepth,
      plugins,
      min,
      callToJSON,
      printFunctionName,
      escapeRegex,
      colors);


      current = iterator.next();

      if (!current.done) {
        result += ',' + spacing;
      }
    }

    result += (min ? '' : ',') + edgeSpacing + prevIndent;
  }

  return result + '}';
}

function printComplexValue(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  refs = refs.slice();
  if (refs.indexOf(val) > -1) {
    return '[Circular]';
  } else {
    refs.push(val);
  }

  currentDepth++;

  var hitMaxDepth = currentDepth > maxDepth;

  if (
  callToJSON &&
  !hitMaxDepth &&
  val.toJSON &&
  typeof val.toJSON === 'function')
  {
    return print(
    val.toJSON(),
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors);

  }

  var toStringed = toString.call(val);
  if (toStringed === '[object Arguments]') {
    return hitMaxDepth ?
    '[Arguments]' :
    printArguments(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors);

  } else if (isToStringedArrayType(toStringed)) {
    return hitMaxDepth ?
    '[Array]' :
    printArray(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors);

  } else if (toStringed === '[object Map]') {
    return hitMaxDepth ?
    '[Map]' :
    printMap(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors);

  } else if (toStringed === '[object Set]') {
    return hitMaxDepth ?
    '[Set]' :
    printSet(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors);

  }

  return hitMaxDepth ?
  '[Object]' :
  printObject(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors);

}

function printPlugin(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  var plugin = void 0;

  for (var p = 0; p < plugins.length; p++) {
    if (plugins[p].test(val)) {
      plugin = plugins[p];
      break;
    }
  }

  if (!plugin) {
    return null;
  }

  function boundPrint(val) {
    return print(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    maxDepth,
    currentDepth,
    plugins,
    min,
    callToJSON,
    printFunctionName,
    escapeRegex,
    colors);

  }

  function boundIndent(str) {
    var indentation = prevIndent + indent;
    return indentation + str.replace(NEWLINE_REGEXP, '\n' + indentation);
  }

  var opts = {
    edgeSpacing: edgeSpacing,
    min: min,
    spacing: spacing };

  return plugin.print(val, boundPrint, boundIndent, opts, colors);
}

function print(
val,
indent,
prevIndent,
spacing,
edgeSpacing,
refs,
maxDepth,
currentDepth,
plugins,
min,
callToJSON,
printFunctionName,
escapeRegex,
colors)
{
  var pluginsResult = printPlugin(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors);

  if (typeof pluginsResult === 'string') {
    return pluginsResult;
  }

  var basicResult = printBasicValue(val, printFunctionName, escapeRegex);
  if (basicResult !== null) {
    return basicResult;
  }

  return printComplexValue(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  maxDepth,
  currentDepth,
  plugins,
  min,
  callToJSON,
  printFunctionName,
  escapeRegex,
  colors);

}

var DEFAULTS = {
  callToJSON: true,
  edgeSpacing: '\n',
  escapeRegex: false,
  highlight: false,
  indent: 2,
  maxDepth: Infinity,
  min: false,
  plugins: [],
  printFunctionName: true,
  spacing: '\n',
  theme: {
    comment: 'gray',
    content: 'reset',
    prop: 'yellow',
    tag: 'cyan',
    value: 'green' } };



function validateOptions(opts) {
  (0, _keys2.default)(opts).forEach(function (key) {
    if (!DEFAULTS.hasOwnProperty(key)) {
      throw new Error('pretty-format: Unknown option "' + key + '".');
    }
  });

  if (opts.min && opts.indent !== undefined && opts.indent !== 0) {
    throw new Error(
    'pretty-format: Options "min" and "indent" cannot be used together.');

  }
}

function normalizeOptions(opts) {
  var result = {};

  (0, _keys2.default)(DEFAULTS).forEach(
  function (key) {return (
      result[key] = opts.hasOwnProperty(key) ?
      key === 'theme' ? normalizeTheme(opts.theme) : opts[key] :
      DEFAULTS[key]);});


  if (result.min) {
    result.indent = 0;
  }

  // $FlowFixMe the type cast below means YOU are responsible to verify the code above.
  return result;
}

function normalizeTheme(themeOption) {
  if (!themeOption) {
    throw new Error('pretty-format: Option "theme" must not be null.');
  }

  if ((typeof themeOption === 'undefined' ? 'undefined' : (0, _typeof3.default)(themeOption)) !== 'object') {
    throw new Error('pretty-format: Option "theme" must be of type "object" but instead received "' + (typeof
    themeOption === 'undefined' ? 'undefined' : (0, _typeof3.default)(themeOption)) + '".');

  }

  // Silently ignore any keys in `theme` that are not in defaults.
  var themeRefined = themeOption;
  var themeDefaults = DEFAULTS.theme;
  return (0, _keys2.default)(themeDefaults).reduce(function (theme, key) {
    theme[key] = Object.prototype.hasOwnProperty.call(themeOption, key) ?
    themeRefined[key] :
    themeDefaults[key];
    return theme;
  }, {});
}

function createIndent(indent) {
  return new Array(indent + 1).join(' ');
}

function prettyFormat(val, initialOptions) {
  var opts = void 0;
  if (!initialOptions) {
    opts = DEFAULTS;
  } else {
    validateOptions(initialOptions);
    opts = normalizeOptions(initialOptions);
  }

  var colors = {
    comment: { close: '', open: '' },
    content: { close: '', open: '' },
    prop: { close: '', open: '' },
    tag: { close: '', open: '' },
    value: { close: '', open: '' } };

  (0, _keys2.default)(opts.theme).forEach(function (key) {
    if (opts.highlight) {
      var color = colors[key] = style[opts.theme[key]];
      if (
      !color ||
      typeof color.close !== 'string' ||
      typeof color.open !== 'string')
      {
        throw new Error('pretty-format: Option "theme" has a key "' +
        key + '" whose value "' + opts.theme[key] + '" is undefined in ansi-styles.');

      }
    }
  });

  var indent = void 0;
  var refs = void 0;
  var prevIndent = '';
  var currentDepth = 0;
  var spacing = opts.min ? ' ' : '\n';
  var edgeSpacing = opts.min ? '' : '\n';

  if (opts && opts.plugins.length) {
    indent = createIndent(opts.indent);
    refs = [];
    var pluginsResult = printPlugin(
    val,
    indent,
    prevIndent,
    spacing,
    edgeSpacing,
    refs,
    opts.maxDepth,
    currentDepth,
    opts.plugins,
    opts.min,
    opts.callToJSON,
    opts.printFunctionName,
    opts.escapeRegex,
    colors);

    if (typeof pluginsResult === 'string') {
      return pluginsResult;
    }
  }

  var basicResult = printBasicValue(
  val,
  opts.printFunctionName,
  opts.escapeRegex);

  if (basicResult !== null) {
    return basicResult;
  }

  if (!indent) {
    indent = createIndent(opts.indent);
  }
  if (!refs) {
    refs = [];
  }
  return printComplexValue(
  val,
  indent,
  prevIndent,
  spacing,
  edgeSpacing,
  refs,
  opts.maxDepth,
  currentDepth,
  opts.plugins,
  opts.min,
  opts.callToJSON,
  opts.printFunctionName,
  opts.escapeRegex,
  colors);

}

prettyFormat.plugins = {
  AsymmetricMatcher: require('./plugins/AsymmetricMatcher'),
  ConvertAnsi: require('./plugins/ConvertAnsi'),
  HTMLElement: require('./plugins/HTMLElement'),
  Immutable: require('./plugins/ImmutablePlugins'),
  ReactElement: require('./plugins/ReactElement'),
  ReactTestComponent: require('./plugins/ReactTestComponent') };


module.exports = prettyFormat;