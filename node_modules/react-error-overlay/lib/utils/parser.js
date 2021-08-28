function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import StackFrame from './stack-frame';

var regexExtractLocation = /\(?(.+?)(?::(\d+))?(?::(\d+))?\)?$/;

function extractLocation(token) {
  return regexExtractLocation.exec(token).slice(1).map(function (v) {
    var p = Number(v);
    if (!isNaN(p)) {
      return p;
    }
    return v;
  });
}

var regexValidFrame_Chrome = /^\s*(at|in)\s.+(:\d+)/;
var regexValidFrame_FireFox = /(^|@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

function parseStack(stack) {
  var frames = stack.filter(function (e) {
    return regexValidFrame_Chrome.test(e) || regexValidFrame_FireFox.test(e);
  }).map(function (e) {
    if (regexValidFrame_FireFox.test(e)) {
      // Strip eval, we don't care about it
      var isEval = false;
      if (/ > (eval|Function)/.test(e)) {
        e = e.replace(/ line (\d+)(?: > eval line \d+)* > (eval|Function):\d+:\d+/g, ':$1');
        isEval = true;
      }
      var data = e.split(/[@]/g);
      var last = data.pop();
      return new (Function.prototype.bind.apply(StackFrame, [null].concat([data.join('@') || (isEval ? 'eval' : null)], _toConsumableArray(extractLocation(last)))))();
    } else {
      // Strip eval, we don't care about it
      if (e.indexOf('(eval ') !== -1) {
        e = e.replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
      }
      if (e.indexOf('(at ') !== -1) {
        e = e.replace(/\(at /, '(');
      }
      var _data = e.trim().split(/\s+/g).slice(1);
      var _last = _data.pop();
      return new (Function.prototype.bind.apply(StackFrame, [null].concat([_data.join(' ') || null], _toConsumableArray(extractLocation(_last)))))();
    }
  });
  return frames;
}

/**
 * Turns an <code>Error</code>, or similar object, into a set of <code>StackFrame</code>s.
 * @alias parse
 */
function parseError(error) {
  if (error == null) {
    throw new Error('You cannot pass a null object.');
  }
  if (typeof error === 'string') {
    return parseStack(error.split('\n'));
  }
  if (Array.isArray(error)) {
    return parseStack(error);
  }
  if (typeof error.stack === 'string') {
    return parseStack(error.stack.split('\n'));
  }
  throw new Error('The error you provided does not contain a stack trace.');
}

export { parseError as parse };
export default parseError;