import _regeneratorRuntime from 'babel-runtime/regenerator';

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { unmap } from '../utils/unmapper';
import { parse } from '../utils/parser';
import fs from 'fs';
import { resolve } from 'path';

test('basic warning', _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
  var error, frames, expected;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          expect.assertions(2);
          error = 'Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `B`. See https://fb.me/react-warning-keys for more information.\n    in div (at B.js:8)\n    in B (at A.js:6)\n    in A (at App.js:8)\n    in div (at App.js:10)\n    in App (at index.js:6)';


          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs')).toString('utf8'));
          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs.map')).toString('utf8'));
          _context.next = 6;
          return unmap('/static/js/bundle.js', parse(error), 0);

        case 6:
          frames = _context.sent;
          expected = JSON.parse(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle2.json')).toString('utf8'));

          expect(frames).toEqual(expected);

          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs')).toString('utf8'));
          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs.map')).toString('utf8'));
          _context.t0 = expect;
          _context.next = 14;
          return unmap('/static/js/bundle.js', expected);

        case 14:
          _context.t1 = _context.sent;
          _context.t2 = expected;
          (0, _context.t0)(_context.t1).toEqual(_context.t2);

        case 17:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, _this);
})));

test('default context & unfound source', _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
  var error, frames;
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          expect.assertions(1);
          error = 'Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `B`. See https://fb.me/react-warning-keys for more information.\n    in div (at B.js:8)\n    in unknown (at blabla.js:10)';


          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs')).toString('utf8'));
          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle_u.mjs.map')).toString('utf8'));
          _context2.next = 6;
          return unmap('/static/js/bundle.js', parse(error));

        case 6:
          frames = _context2.sent;

          expect(frames).toMatchSnapshot();

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, _this);
})));