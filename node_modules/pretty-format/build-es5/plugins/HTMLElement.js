'use strict';var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var escapeHTML = require('./lib/escapeHTML'); /**
                                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                               *
                                               * This source code is licensed under the BSD-style license found in the
                                               * LICENSE file in the root directory of this source tree. An additional grant
                                               * of patent rights can be found in the PATENTS file in the same directory.
                                               *
                                               * 
                                               */















var HTML_ELEMENT_REGEXP = /(HTML\w*?Element)|Text|Comment/;
var test = isHTMLElement;

function isHTMLElement(value) {
  return (
    value !== undefined &&
    value !== null && (
    value.nodeType === 1 || value.nodeType === 3 || value.nodeType === 8) &&
    value.constructor !== undefined &&
    value.constructor.name !== undefined &&
    HTML_ELEMENT_REGEXP.test(value.constructor.name));

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
  filter(function (value) {return value.trim().length;}).
  join(opts.edgeSpacing);
}

function printAttributes(attributes, indent, colors, opts) {
  return attributes.
  sort().
  map(function (attribute) {
    return (
      opts.spacing +
      indent(colors.prop.open + attribute.name + colors.prop.close + '=') +
      colors.value.open + ('"' +
      attribute.value + '"') +
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
  if (element.nodeType === 3) {
    return element.data.
    split('\n').
    map(function (text) {return text.trimLeft();}).
    filter(function (text) {return text.length;}).
    join(' ');
  } else if (element.nodeType === 8) {
    return (
      colors.comment.open +
      '<!-- ' +
      element.data.trim() +
      ' -->' +
      colors.comment.close);

  }

  var result = colors.tag.open + '<';
  var elementName = element.tagName.toLowerCase();
  result += elementName + colors.tag.close;

  var hasAttributes = element.attributes && element.attributes.length;
  if (hasAttributes) {
    var _attributes = Array.prototype.slice.call(element.attributes);
    result += printAttributes(_attributes, indent, colors, opts);
  }

  var flatChildren = Array.prototype.slice.call(element.childNodes);
  if (!flatChildren.length && element.textContent) {
    flatChildren.push(element.textContent);
  }

  var closeInNewLine = hasAttributes && !opts.min;
  if (flatChildren.length) {
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

module.exports = { print: print, test: test };