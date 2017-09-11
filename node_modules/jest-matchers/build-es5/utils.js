'use strict';var _keys = require('babel-runtime/core-js/object/keys');var _keys2 = _interopRequireDefault(_keys);var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
















var hasOwnProperty = function hasOwnProperty(object, value) {return (
    Object.prototype.hasOwnProperty.call(object, value));}; /**
                                                             * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                                             *
                                                             * This source code is licensed under the BSD-style license found in the
                                                             * LICENSE file in the root directory of this source tree. An additional grant
                                                             * of patent rights can be found in the PATENTS file in the same directory.
                                                             *
                                                             * 
                                                             */var getPath = function getPath(object, propertyPath) {if (!Array.isArray(propertyPath)) {propertyPath = propertyPath.split('.');}

  var lastProp = propertyPath.length === 1;

  if (propertyPath.length) {
    var prop = propertyPath[0];
    var newObject = object[prop];
    if (!lastProp && (newObject === null || newObject === undefined)) {
      // This is not the last prop in the chain. If we keep recursing it will
      // hit a `can't access property X of undefined | null`. At this point we
      // know that the chain broken and we return right away.
      return {
        hasEndProp: false,
        lastTraversedObject: object,
        traversedPath: [] };

    } else {
      var result = getPath(newObject, propertyPath.slice(1));
      result.lastTraversedObject || (result.lastTraversedObject = object);
      result.traversedPath.unshift(prop);
      if (propertyPath.length === 1) {
        result.hasEndProp = hasOwnProperty(object, prop);
        if (!result.hasEndProp) {
          delete result.value;
          result.traversedPath.shift();
        }
      }
      return result;
    }
  } else {
    return {
      lastTraversedObject: null,
      traversedPath: [],
      value: object };

  }
};

// Strip properties from object that are not present in the subset. Useful for
// printing the diff for toMatchObject() without adding unrelated noise.
var getObjectSubset = function getObjectSubset(object, subset) {
  if (Array.isArray(object)) {
    if (Array.isArray(subset) && subset.length === object.length) {
      return subset.map(function (sub, i) {return getObjectSubset(object[i], sub);});
    }
  } else if (object instanceof Date) {
    return object;
  } else if (
  (typeof object === 'undefined' ? 'undefined' : (0, _typeof3.default)(object)) === 'object' &&
  object !== null &&
  (typeof subset === 'undefined' ? 'undefined' : (0, _typeof3.default)(subset)) === 'object' &&
  subset !== null)
  {
    var trimmed = {};
    (0, _keys2.default)(subset).
    filter(function (key) {return object.hasOwnProperty(key);}).
    forEach(
    function (key) {return trimmed[key] = getObjectSubset(object[key], subset[key]);});


    if ((0, _keys2.default)(trimmed).length > 0) {
      return trimmed;
    }
  }
  return object;
};

module.exports = {
  getObjectSubset: getObjectSubset,
  getPath: getPath,
  hasOwnProperty: hasOwnProperty };