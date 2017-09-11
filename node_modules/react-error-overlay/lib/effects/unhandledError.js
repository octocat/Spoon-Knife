/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var boundErrorHandler = null;

function errorHandler(callback, e) {
  if (!e.error) {
    return;
  }
  // $FlowFixMe
  var error = e.error;

  if (error instanceof Error) {
    callback(error);
  } else {
    // A non-error was thrown, we don't have a trace. :(
    // Look in your browser's devtools for more information
    callback(new Error(error));
  }
}

function registerUnhandledError(target, callback) {
  if (boundErrorHandler !== null) {
    return;
  }
  boundErrorHandler = errorHandler.bind(undefined, callback);
  target.addEventListener('error', boundErrorHandler);
}

function unregisterUnhandledError(target) {
  if (boundErrorHandler === null) {
    return;
  }
  target.removeEventListener('error', boundErrorHandler);
  boundErrorHandler = null;
}

export { registerUnhandledError as register, unregisterUnhandledError as unregister };