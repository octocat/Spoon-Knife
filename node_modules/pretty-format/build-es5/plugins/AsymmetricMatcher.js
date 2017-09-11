'use strict';var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _for = require('babel-runtime/core-js/symbol/for');var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











var asymmetricMatcher = (0, _for2.default)('jest.asymmetricMatcher'); /**
                                                                       * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                       *
                                                                       * This source code is licensed under the BSD-style license found in the
                                                                       * LICENSE file in the root directory of this source tree. An additional grant
                                                                       * of patent rights can be found in the PATENTS file in the same directory.
                                                                       *
                                                                       * 
                                                                       */var SPACE = ' ';var ArrayContaining = function (_Array) {(0, _inherits3.default)(ArrayContaining, _Array);function ArrayContaining() {(0, _classCallCheck3.default)(this, ArrayContaining);return (0, _possibleConstructorReturn3.default)(this, (ArrayContaining.__proto__ || (0, _getPrototypeOf2.default)(ArrayContaining)).apply(this, arguments));}return ArrayContaining;}(Array);var ObjectContaining = function (_Object) {(0, _inherits3.default)(ObjectContaining, _Object);function ObjectContaining() {(0, _classCallCheck3.default)(this, ObjectContaining);return (0, _possibleConstructorReturn3.default)(this, (ObjectContaining.__proto__ || (0, _getPrototypeOf2.default)(ObjectContaining)).apply(this, arguments));}return ObjectContaining;}(Object);var print = function print(val, _print,
indent,
opts,
colors)
{
  var stringedValue = val.toString();

  if (stringedValue === 'ArrayContaining') {
    var array = ArrayContaining.from(val.sample);
    return opts.spacing === SPACE ?
    stringedValue + SPACE + _print(array) :
    _print(array);
  }

  if (stringedValue === 'ObjectContaining') {
    var object = (0, _assign2.default)(new ObjectContaining(), val.sample);
    return opts.spacing === SPACE ?
    stringedValue + SPACE + _print(object) :
    _print(object);
  }

  if (stringedValue === 'StringMatching') {
    return stringedValue + SPACE + _print(val.sample);
  }

  if (stringedValue === 'StringContaining') {
    return stringedValue + SPACE + _print(val.sample);
  }

  return val.toAsymmetricMatcher();
};

var test = function test(object) {return object && object.$$typeof === asymmetricMatcher;};

module.exports = { print: print, test: test };