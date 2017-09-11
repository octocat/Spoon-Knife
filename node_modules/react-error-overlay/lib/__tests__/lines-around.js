/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { getLinesAround } from '../utils/getLinesAround';

var arr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

test('should return lines around from a string', function () {
  expect(getLinesAround(4, 2, arr)).toMatchSnapshot();
});

test('should return lines around from an array', function () {
  expect(getLinesAround(4, 2, arr.join('\n'))).toMatchSnapshot();
});