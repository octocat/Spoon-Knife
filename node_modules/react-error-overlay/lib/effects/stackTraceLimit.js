/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var stackTraceRegistered = false;
// Default: https://docs.microsoft.com/en-us/scripting/javascript/reference/stacktracelimit-property-error-javascript
var restoreStackTraceValue = 10;

var MAX_STACK_LENGTH = 50;

function registerStackTraceLimit() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MAX_STACK_LENGTH;

  if (stackTraceRegistered) {
    return;
  }
  try {
    restoreStackTraceValue = Error.stackTraceLimit;
    Error.stackTraceLimit = limit;
    stackTraceRegistered = true;
  } catch (e) {
    // Not all browsers support this so we don't care if it errors
  }
}

function unregisterStackTraceLimit() {
  if (!stackTraceRegistered) {
    return;
  }
  try {
    Error.stackTraceLimit = restoreStackTraceValue;
    stackTraceRegistered = false;
  } catch (e) {
    // Not all browsers support this so we don't care if it errors
  }
}

export { registerStackTraceLimit as register, unregisterStackTraceLimit as unregister };