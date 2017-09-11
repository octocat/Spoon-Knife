/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

// setimmediate adds setImmediate to the global. We want to make sure we export
// the actual function.

require('setimmediate');
module.exports = global.setImmediate;