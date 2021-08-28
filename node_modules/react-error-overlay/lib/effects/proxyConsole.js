
var reactFrameStack = []; /**
                           * Copyright (c) 2015-present, Facebook, Inc.
                           * All rights reserved.
                           *
                           * This source code is licensed under the BSD-style license found in the
                           * LICENSE file in the root directory of this source tree. An additional grant
                           * of patent rights can be found in the PATENTS file in the same directory.
                           */

// This is a stripped down barebones version of this proposal:
// https://gist.github.com/sebmarkbage/bdefa100f19345229d526d0fdd22830f
// We're implementing just enough to get the invalid element type warnings
// to display the component stack in React 15.6+:
// https://github.com/facebook/react/pull/9679
/// TODO: a more comprehensive implementation.

var registerReactStack = function registerReactStack() {
  if (typeof console !== 'undefined') {
    // $FlowFixMe
    console.reactStack = function (frames) {
      return reactFrameStack.push(frames);
    };
    // $FlowFixMe
    console.reactStackEnd = function (frames) {
      return reactFrameStack.pop();
    };
  }
};

var unregisterReactStack = function unregisterReactStack() {
  if (typeof console !== 'undefined') {
    // $FlowFixMe
    console.reactStack = undefined;
    // $FlowFixMe
    console.reactStackEnd = undefined;
  }
};

var permanentRegister = function proxyConsole(type, callback) {
  if (typeof console !== 'undefined') {
    var orig = console[type];
    if (typeof orig === 'function') {
      console[type] = function __stack_frame_overlay_proxy_console__() {
        try {
          var _message = arguments[0];
          if (typeof _message === 'string' && reactFrameStack.length > 0) {
            callback(_message, reactFrameStack[reactFrameStack.length - 1]);
          }
        } catch (err) {
          // Warnings must never crash. Rethrow with a clean stack.
          setTimeout(function () {
            throw err;
          });
        }
        return orig.apply(this, arguments);
      };
    }
  }
};

export { permanentRegister, registerReactStack, unregisterReactStack };