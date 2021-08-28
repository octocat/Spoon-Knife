'use strict';var _typeof2 = require('babel-runtime/helpers/typeof');var _typeof3 = _interopRequireDefault(_typeof2);var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _for = require('babel-runtime/core-js/symbol/for');var _for2 = _interopRequireDefault(_for);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Copyright (c) 2014, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * This source code is licensed under the BSD-style license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * LICENSE file in the root directory of this source tree. An additional grant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * of patent rights can be found in the PATENTS file in the same directory.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */var _require =







require('./jasmine-utils'),equals = _require.equals,fnNameFor = _require.fnNameFor,hasProperty = _require.hasProperty,isA = _require.isA,isUndefined = _require.isUndefined;var

AsymmetricMatcher =


function AsymmetricMatcher() {(0, _classCallCheck3.default)(this, AsymmetricMatcher);
  this.$$typeof = (0, _for2.default)('jest.asymmetricMatcher');
};var


Any = function (_AsymmetricMatcher) {(0, _inherits3.default)(Any, _AsymmetricMatcher);


  function Any(sample) {(0, _classCallCheck3.default)(this, Any);var _this = (0, _possibleConstructorReturn3.default)(this, (Any.__proto__ || (0, _getPrototypeOf2.default)(Any)).call(this));

    if (typeof sample === 'undefined') {
      throw new TypeError(
      'any() expects to be passed a constructor function. ' +
      'Please pass one or use anything() to match any object.');

    }
    _this.sample = sample;return _this;
  }(0, _createClass3.default)(Any, [{ key: 'asymmetricMatch', value: function asymmetricMatch(

    other) {
      if (this.sample == String) {
        return typeof other == 'string' || other instanceof String;
      }

      if (this.sample == Number) {
        return typeof other == 'number' || other instanceof Number;
      }

      if (this.sample == Function) {
        return typeof other == 'function' || other instanceof Function;
      }

      if (this.sample == Object) {
        return (typeof other === 'undefined' ? 'undefined' : (0, _typeof3.default)(other)) == 'object';
      }

      if (this.sample == Boolean) {
        return typeof other == 'boolean';
      }

      return other instanceof this.sample;
    } }, { key: 'toString', value: function toString()

    {
      return 'Any';
    } }, { key: 'getExpectedType', value: function getExpectedType()

    {
      if (this.sample == String) {
        return 'string';
      }

      if (this.sample == Number) {
        return 'number';
      }

      if (this.sample == Function) {
        return 'function';
      }

      if (this.sample == Object) {
        return 'object';
      }

      if (this.sample == Boolean) {
        return 'boolean';
      }

      return fnNameFor(this.sample);
    } }, { key: 'toAsymmetricMatcher', value: function toAsymmetricMatcher()

    {
      return 'Any<' + fnNameFor(this.sample) + '>';
    } }]);return Any;}(AsymmetricMatcher);var


Anything = function (_AsymmetricMatcher2) {(0, _inherits3.default)(Anything, _AsymmetricMatcher2);function Anything() {(0, _classCallCheck3.default)(this, Anything);return (0, _possibleConstructorReturn3.default)(this, (Anything.__proto__ || (0, _getPrototypeOf2.default)(Anything)).apply(this, arguments));}(0, _createClass3.default)(Anything, [{ key: 'asymmetricMatch', value: function asymmetricMatch(
    other) {
      return !isUndefined(other) && other !== null;
    } }, { key: 'toString', value: function toString()

    {
      return 'Anything';
    }

    // No getExpectedType method, because it matches either null or undefined.
  }, { key: 'toAsymmetricMatcher', value: function toAsymmetricMatcher()
    {
      return 'Anything';
    } }]);return Anything;}(AsymmetricMatcher);var


ArrayContaining = function (_AsymmetricMatcher3) {(0, _inherits3.default)(ArrayContaining, _AsymmetricMatcher3);


  function ArrayContaining(sample) {(0, _classCallCheck3.default)(this, ArrayContaining);var _this3 = (0, _possibleConstructorReturn3.default)(this, (ArrayContaining.__proto__ || (0, _getPrototypeOf2.default)(ArrayContaining)).call(this));

    _this3.sample = sample;return _this3;
  }(0, _createClass3.default)(ArrayContaining, [{ key: 'asymmetricMatch', value: function asymmetricMatch(

    other) {
      if (!Array.isArray(this.sample)) {
        throw new Error(
        "You must provide an array to ArrayContaining, not '" + (0, _typeof3.default)(
        this.sample) +
        "'.");

      }

      return (
        this.sample.length === 0 ||
        Array.isArray(other) &&
        this.sample.every(function (item) {return other.some(function (another) {return equals(item, another);});}));

    } }, { key: 'toString', value: function toString()

    {
      return 'ArrayContaining';
    } }, { key: 'getExpectedType', value: function getExpectedType()

    {
      return 'array';
    } }]);return ArrayContaining;}(AsymmetricMatcher);var


ObjectContaining = function (_AsymmetricMatcher4) {(0, _inherits3.default)(ObjectContaining, _AsymmetricMatcher4);


  function ObjectContaining(sample) {(0, _classCallCheck3.default)(this, ObjectContaining);var _this4 = (0, _possibleConstructorReturn3.default)(this, (ObjectContaining.__proto__ || (0, _getPrototypeOf2.default)(ObjectContaining)).call(this));

    _this4.sample = sample;return _this4;
  }(0, _createClass3.default)(ObjectContaining, [{ key: 'asymmetricMatch', value: function asymmetricMatch(

    other) {
      if ((0, _typeof3.default)(this.sample) !== 'object') {
        throw new Error(
        "You must provide an object to ObjectContaining, not '" + (0, _typeof3.default)(
        this.sample) +
        "'.");

      }

      for (var property in this.sample) {
        if (
        !hasProperty(other, property) ||
        !equals(this.sample[property], other[property]))
        {
          return false;
        }
      }

      return true;
    } }, { key: 'toString', value: function toString()

    {
      return 'ObjectContaining';
    } }, { key: 'getExpectedType', value: function getExpectedType()

    {
      return 'object';
    } }]);return ObjectContaining;}(AsymmetricMatcher);var


StringContaining = function (_AsymmetricMatcher5) {(0, _inherits3.default)(StringContaining, _AsymmetricMatcher5);


  function StringContaining(sample) {(0, _classCallCheck3.default)(this, StringContaining);var _this5 = (0, _possibleConstructorReturn3.default)(this, (StringContaining.__proto__ || (0, _getPrototypeOf2.default)(StringContaining)).call(this));

    if (!isA('String', sample)) {
      throw new Error('Expected is not a string');
    }
    _this5.sample = sample;return _this5;
  }(0, _createClass3.default)(StringContaining, [{ key: 'asymmetricMatch', value: function asymmetricMatch(

    other) {
      return other.includes(this.sample);
    } }, { key: 'toString', value: function toString()

    {
      return 'StringContaining';
    } }, { key: 'getExpectedType', value: function getExpectedType()

    {
      return 'string';
    } }]);return StringContaining;}(AsymmetricMatcher);var


StringMatching = function (_AsymmetricMatcher6) {(0, _inherits3.default)(StringMatching, _AsymmetricMatcher6);


  function StringMatching(sample) {(0, _classCallCheck3.default)(this, StringMatching);var _this6 = (0, _possibleConstructorReturn3.default)(this, (StringMatching.__proto__ || (0, _getPrototypeOf2.default)(StringMatching)).call(this));

    if (!isA('String', sample) && !isA('RegExp', sample)) {
      throw new Error('Expected is not a String or a RegExp');
    }

    _this6.sample = new RegExp(sample);return _this6;
  }(0, _createClass3.default)(StringMatching, [{ key: 'asymmetricMatch', value: function asymmetricMatch(

    other) {
      return this.sample.test(other);
    } }, { key: 'toString', value: function toString()

    {
      return 'StringMatching';
    } }, { key: 'getExpectedType', value: function getExpectedType()

    {
      return 'string';
    } }]);return StringMatching;}(AsymmetricMatcher);


module.exports = {
  any: function any(expectedObject) {return new Any(expectedObject);},
  anything: function anything() {return new Anything();},
  arrayContaining: function arrayContaining(sample) {return new ArrayContaining(sample);},
  objectContaining: function objectContaining(sample) {return new ObjectContaining(sample);},
  stringContaining: function stringContaining(expected) {return new StringContaining(expected);},
  stringMatching: function stringMatching(expected) {return new StringMatching(expected);} };