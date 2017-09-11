'use strict';











var ansiRegex = require('ansi-regex'); /**
                                        * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                        *
                                        * This source code is licensed under the BSD-style license found in the
                                        * LICENSE file in the root directory of this source tree. An additional grant
                                        * of patent rights can be found in the PATENTS file in the same directory.
                                        *
                                        * 
                                        */var toHumanReadableAnsi = function toHumanReadableAnsi(text) {var style = require('ansi-styles');return text.replace(ansiRegex(), function (match, offset, string) {switch (match) {case style.red.close:case style.green.close:case style.reset.open:
      case style.reset.close:
        return '</>';
      case style.red.open:
        return '<red>';
      case style.green.open:
        return '<green>';
      case style.dim.open:
        return '<dim>';
      case style.bold.open:
        return '<bold>';
      default:
        return '';}

  });
};

var test = function test(value) {return (
    typeof value === 'string' && value.match(ansiRegex()));};

var print = function print(
val,
_print,
indent,
opts,
colors) {return (
    _print(toHumanReadableAnsi(val)));};

module.exports = { print: print, test: test };