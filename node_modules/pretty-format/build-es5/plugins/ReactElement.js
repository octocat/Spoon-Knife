'use strict';var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _for = require('babel-runtime/core-js/symbol/for');var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var escapeHTML = require('./lib/escapeHTML'); /**
                                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                               *
                                               * This source code is licensed under the BSD-style license found in the
                                               * LICENSE file in the root directory of this source tree. An additional grant
                                               * of patent rights can be found in the PATENTS file in the same directory.
                                               *
                                               * 
                                               */var reactElement = (0, _for2.default)('react.element');function traverseChildren(opaqueChildren, cb) {if (Array.isArray(opaqueChildren)) {opaqueChildren.forEach(function (child) {return traverseChildren(child, cb);});} else if (opaqueChildren != null && opaqueChildren !== false) {cb(opaqueChildren);
  }
}

function printChildren(flatChildren, print, indent, colors, opts) {
  return flatChildren.
  map(function (node) {
    if ((typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === 'object') {
      return print(node, print, indent, colors, opts);
    } else if (typeof node === 'string') {
      return colors.content.open + escapeHTML(node) + colors.content.close;
    } else {
      return print(node);
    }
  }).
  join(opts.edgeSpacing);
}

function printProps(props, print, indent, colors, opts) {
  return (0, _keys2.default)(props).
  sort().
  map(function (name) {
    if (name === 'children') {
      return '';
    }

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

var print = function print(
element,
_print,
indent,
opts,
colors)
{
  var result = colors.tag.open + '<';
  var elementName = void 0;
  if (typeof element.type === 'string') {
    elementName = element.type;
  } else if (typeof element.type === 'function') {
    elementName = element.type.displayName || element.type.name || 'Unknown';
  } else {
    elementName = 'Unknown';
  }
  result += elementName + colors.tag.close;
  result += printProps(element.props, _print, indent, colors, opts);

  var opaqueChildren = element.props.children;
  var hasProps = !!(0, _keys2.default)(element.props).filter(
  function (propName) {return propName !== 'children';}).
  length;
  var closeInNewLine = hasProps && !opts.min;

  if (opaqueChildren) {
    var flatChildren = [];
    traverseChildren(opaqueChildren, function (child) {
      flatChildren.push(child);
    });
    var children = printChildren(flatChildren, _print, indent, colors, opts);
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
    elementName +
    '>' +
    colors.tag.close;
  } else {
    result +=
    colors.tag.open + (closeInNewLine ? '\n' : ' ') + '/>' + colors.tag.close;
  }

  return result;
};

var test = function test(object) {return object && object.$$typeof === reactElement;};

module.exports = { print: print, test: test };