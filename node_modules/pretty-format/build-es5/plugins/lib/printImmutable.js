'use strict';var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var IMMUTABLE_NAMESPACE = 'Immutable.'; /**
                                         * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                         *
                                         * This source code is licensed under the BSD-style license found in the
                                         * LICENSE file in the root directory of this source tree. An additional grant
                                         * of patent rights can be found in the PATENTS file in the same directory.
                                         *
                                         * 
                                         */var SPACE = ' ';var addKey = function addKey(isMap, key) {return isMap ? key + ': ' : '';};var addFinalEdgeSpacing = function addFinalEdgeSpacing(length, edgeSpacing) {return length > 0 ? edgeSpacing : '';};var printImmutable = function printImmutable(
val,
print,
indent,
opts,
colors,
immutableDataStructureName,
isMap)
{var _ref =
  isMap ? ['{', '}'] : ['[', ']'],_ref2 = (0, _slicedToArray3.default)(_ref, 2),openTag = _ref2[0],closeTag = _ref2[1];
  var result =
  IMMUTABLE_NAMESPACE +
  immutableDataStructureName +
  SPACE +
  openTag +
  opts.edgeSpacing;

  var immutableArray = [];
  val.forEach(function (item, key) {return (
      immutableArray.push(
      indent(addKey(isMap, key) + print(item, print, indent, opts, colors))));});



  result += immutableArray.join(',' + opts.spacing);
  if (!opts.min && immutableArray.length > 0) {
    result += ',';
  }

  return (
    result +
    addFinalEdgeSpacing(immutableArray.length, opts.edgeSpacing) +
    closeTag);

};

module.exports = printImmutable;