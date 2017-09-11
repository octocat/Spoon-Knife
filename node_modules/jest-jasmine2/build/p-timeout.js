"use strict"; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */

// A specialized version of `p-timeout` that does not touch globals.
// It does not throw on timeout.
function pTimeout(
promise,
ms,
clearTimeout,
setTimeout,
onTimeout)
{
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(onTimeout()), ms);
    promise.then(
    val => {
      clearTimeout(timer);
      resolve(val);
    },
    err => {
      clearTimeout(timer);
      reject(err);
    });

  });
}

module.exports = pTimeout;