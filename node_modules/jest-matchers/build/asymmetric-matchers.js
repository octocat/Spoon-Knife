'use strict'; /**
               * Copyright (c) 2014, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */var _require =







require('./jasmine-utils');const equals = _require.equals,fnNameFor = _require.fnNameFor,hasProperty = _require.hasProperty,isA = _require.isA,isUndefined = _require.isUndefined;

class AsymmetricMatcher {


  constructor() {
    this.$$typeof = Symbol.for('jest.asymmetricMatcher');
  }}


class Any extends AsymmetricMatcher {


  constructor(sample) {
    super();
    if (typeof sample === 'undefined') {
      throw new TypeError(
      'any() expects to be passed a constructor function. ' +
      'Please pass one or use anything() to match any object.');

    }
    this.sample = sample;
  }

  asymmetricMatch(other) {
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
      return typeof other == 'object';
    }

    if (this.sample == Boolean) {
      return typeof other == 'boolean';
    }

    return other instanceof this.sample;
  }

  toString() {
    return 'Any';
  }

  getExpectedType() {
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
  }

  toAsymmetricMatcher() {
    return 'Any<' + fnNameFor(this.sample) + '>';
  }}


class Anything extends AsymmetricMatcher {
  asymmetricMatch(other) {
    return !isUndefined(other) && other !== null;
  }

  toString() {
    return 'Anything';
  }

  // No getExpectedType method, because it matches either null or undefined.

  toAsymmetricMatcher() {
    return 'Anything';
  }}


class ArrayContaining extends AsymmetricMatcher {


  constructor(sample) {
    super();
    this.sample = sample;
  }

  asymmetricMatch(other) {
    if (!Array.isArray(this.sample)) {
      throw new Error(
      "You must provide an array to ArrayContaining, not '" +
      typeof this.sample +
      "'.");

    }

    return (
      this.sample.length === 0 ||
      Array.isArray(other) &&
      this.sample.every(item => other.some(another => equals(item, another))));

  }

  toString() {
    return 'ArrayContaining';
  }

  getExpectedType() {
    return 'array';
  }}


class ObjectContaining extends AsymmetricMatcher {


  constructor(sample) {
    super();
    this.sample = sample;
  }

  asymmetricMatch(other) {
    if (typeof this.sample !== 'object') {
      throw new Error(
      "You must provide an object to ObjectContaining, not '" +
      typeof this.sample +
      "'.");

    }

    for (const property in this.sample) {
      if (
      !hasProperty(other, property) ||
      !equals(this.sample[property], other[property]))
      {
        return false;
      }
    }

    return true;
  }

  toString() {
    return 'ObjectContaining';
  }

  getExpectedType() {
    return 'object';
  }}


class StringContaining extends AsymmetricMatcher {


  constructor(sample) {
    super();
    if (!isA('String', sample)) {
      throw new Error('Expected is not a string');
    }
    this.sample = sample;
  }

  asymmetricMatch(other) {
    return other.includes(this.sample);
  }

  toString() {
    return 'StringContaining';
  }

  getExpectedType() {
    return 'string';
  }}


class StringMatching extends AsymmetricMatcher {


  constructor(sample) {
    super();
    if (!isA('String', sample) && !isA('RegExp', sample)) {
      throw new Error('Expected is not a String or a RegExp');
    }

    this.sample = new RegExp(sample);
  }

  asymmetricMatch(other) {
    return this.sample.test(other);
  }

  toString() {
    return 'StringMatching';
  }

  getExpectedType() {
    return 'string';
  }}


module.exports = {
  any: expectedObject => new Any(expectedObject),
  anything: () => new Anything(),
  arrayContaining: sample => new ArrayContaining(sample),
  objectContaining: sample => new ObjectContaining(sample),
  stringContaining: expected => new StringContaining(expected),
  stringMatching: expected => new StringMatching(expected) };