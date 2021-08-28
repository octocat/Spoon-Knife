/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _require = require('./ReactFiber'),
    createFiberFromElementType = _require.createFiberFromElementType;

exports.createReifiedYield = function (yieldNode) {
  var fiber = createFiberFromElementType(yieldNode.continuation, yieldNode.key);
  return {
    continuation: fiber,
    props: yieldNode.props
  };
};

exports.createUpdatedReifiedYield = function (previousYield, yieldNode) {
  return {
    continuation: previousYield.continuation,
    props: yieldNode.props
  };
};