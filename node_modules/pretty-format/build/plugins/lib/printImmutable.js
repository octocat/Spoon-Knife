'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();











const IMMUTABLE_NAMESPACE = 'Immutable.'; /**
                                           * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                           *
                                           * This source code is licensed under the BSD-style license found in the
                                           * LICENSE file in the root directory of this source tree. An additional grant
                                           * of patent rights can be found in the PATENTS file in the same directory.
                                           *
                                           * 
                                           */const SPACE = ' ';const addKey = (isMap, key) => isMap ? key + ': ' : '';const addFinalEdgeSpacing = (length, edgeSpacing) => length > 0 ? edgeSpacing : '';const printImmutable = (
val,
print,
indent,
opts,
colors,
immutableDataStructureName,
isMap) =>
{var _ref =
  isMap ? ['{', '}'] : ['[', ']'],_ref2 = _slicedToArray(_ref, 2);const openTag = _ref2[0],closeTag = _ref2[1];
  let result =
  IMMUTABLE_NAMESPACE +
  immutableDataStructureName +
  SPACE +
  openTag +
  opts.edgeSpacing;

  const immutableArray = [];
  val.forEach((item, key) =>
  immutableArray.push(
  indent(addKey(isMap, key) + print(item, print, indent, opts, colors))));



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