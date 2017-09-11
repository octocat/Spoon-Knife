/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { parse } from '../../utils/parser';

test('eval 1', function () {
  expect(parse('test1@file:///C:/example.html line 7 > eval line 1 > eval:1:1\ntest2@file:///C:/example.html line 7 > eval:1:1\ntest3@file:///C:/example.html:7:6'.split('\n'))).toMatchSnapshot();
});

test('eval 2', function () {
  expect(parse({
    stack: 'anonymous@file:///C:/example.html line 7 > Function:1:1\n@file:///C:/example.html:7:6'
  })).toMatchSnapshot();
});

test('stack with eval', function () {
  expect(parse('e@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:25:9\n@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html line 17 > eval:1:1\na@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:8:9\n@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:32:7')).toMatchSnapshot();
});

test('v14 to v29', function () {
  expect(parse('trace@file:///C:/example.html:9\nb@file:///C:/example.html:16\na@file:///C:/example.html:19\n@file:///C:/example.html:21')).toMatchSnapshot();
});

test('v30+', function () {
  expect(parse('trace@file:///C:/example.html:9:17\nb@file:///C:/example.html:16:13\na@file:///C:/example.html:19:13\n@file:///C:/example.html:21:9')).toMatchSnapshot();
});