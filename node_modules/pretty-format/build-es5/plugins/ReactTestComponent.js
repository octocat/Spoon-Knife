'use strict';var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _for = require('babel-runtime/core-js/symbol/for');var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}



















var escapeHTML = require('./lib/escapeHTML'); /**
                                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                               *
                                               * This source code is licensed under the BSD-style license found in the
                                               * LICENSE file in the root directory of this source tree. An additional grant
                                               * of patent rights can be found in the PATENTS file in the same directory.
                                               *
                                               * 
                                               */var reactTestInstance = (0, _for2.default)('react.test.json');function printChildren(children, print, indent, colors,
opts)
{
  return children.
  map(function (child) {return printInstance(child, print, indent, colors, opts);}).
  join(opts.edgeSpacing);
}

function printProps(props, print, indent, colors, opts) {
  return (0, _keys2.default)(props).
  sort().
  map(function (name) {
    var prop = props[name];
    var printed = print(prop);

    if (typeof prop !== 'string') {
      if (printed.indexOf('\n') !== -1) {
        printed =
        '{' +
        opts.edgeSpacing +
        indent(indent(printed) + opts.edgeSpacing + '}');
      } else {
        printed = '{' + printed + '}';
      }
    }

    return (
      opts.spacing +
      indent(colors.prop.open + name + colors.prop.close + '=') +
      colors.value.open +
      printed +
      colors.value.close);

  }).
  join('');
}

function printInstance(instance, print, indent, colors, opts) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return colors.content.open + escapeHTML(instance) + colors.content.close;
  }

  var closeInNewLine = false;
  var result = colors.tag.open + '<' + instance.type + colors.tag.close;

  if (instance.props) {
    closeInNewLine = !!(0, _keys2.default)(instance.props).length && !opts.min;
    result += printProps(instance.props, print, indent, colors, opts);
  }

  if (instance.children) {
    var children = printChildren(
    instance.children,
    print,
    indent,
    colors,
    opts);

    result +=
    colors.tag.open + (
    closeInNewLine ? '\n' : '') +
    '>' +
    colors.tag.close +
    opts.edgeSpacing +
    indent(children) +
    opts.edgeSpacing +
    colors.tag.open +
    '</' +
    instance.type +
    '>' +
    colors.tag.close;
  } else {
    result +=
    colors.tag.open + (closeInNewLine ? '\n' : ' ') + '/>' + colors.tag.close;
  }

  return result;
}

var print = function print(
val,
_print,
indent,
opts,
colors) {return (
    printInstance(val, _print, indent, colors, opts));};

var test = function test(object) {return (
    object && object.$$typeof === reactTestInstance);};

module.exports = { print: print, test: test };