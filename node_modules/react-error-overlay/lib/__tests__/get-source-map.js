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

import { getSourceMap } from '../utils/getSourceMap';
import fs from 'fs';
import { resolve } from 'path';

test('finds an external source map', _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
  var file, sm;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          file = fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs')).toString('utf8');

          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs.map')).toString('utf8'));

          _context.next = 4;
          return getSourceMap('/', file);

        case 4:
          sm = _context.sent;

          expect(sm.getOriginalPosition(26122, 21)).toEqual({
            line: 7,
            column: 0,
            source: 'webpack:///packages/react-scripts/template/src/App.js'
          });

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, _this);
})));

test('find an inline source map', _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
  var sourceName, file, fileO, sm;
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          sourceName = 'test.js';
          file = fs.readFileSync(resolve(__dirname, '../../fixtures/inline.mjs')).toString('utf8');
          fileO = fs.readFileSync(resolve(__dirname, '../../fixtures/inline.es6.mjs')).toString('utf8');
          _context2.next = 5;
          return getSourceMap('/', file);

        case 5:
          sm = _context2.sent;

          expect(sm.getSources()).toEqual([sourceName]);
          expect(sm.getSource(sourceName)).toBe(fileO);
          expect(sm.getGeneratedPosition(sourceName, 5, 10)).toEqual({
            line: 10,
            column: 8
          });

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, _this);
})));

test('error on a source map with unsupported encoding', _asyncToGenerator(_regeneratorRuntime.mark(function _callee3() {
  var file;
  return _regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          expect.assertions(2);

          file = fs.readFileSync(resolve(__dirname, '../../fixtures/junk-inline.mjs')).toString('utf8');
          _context3.prev = 2;
          _context3.next = 5;
          return getSourceMap('/', file);

        case 5:
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3['catch'](2);

          expect(_context3.t0 instanceof Error).toBe(true);
          expect(_context3.t0.message).toBe('Sorry, non-base64 inline source-map encoding is not supported.');

        case 11:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, _this, [[2, 7]]);
})));