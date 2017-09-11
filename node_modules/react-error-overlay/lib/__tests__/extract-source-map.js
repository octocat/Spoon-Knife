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

import { extractSourceMapUrl } from '../utils/getSourceMap';

test('extracts last source map directive', _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
  var res;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return extractSourceMapUrl('test.js', '//# sourceMappingURL=test.js.map\nconsole.log(\'a\')\n//# sourceMappingURL=bundle.js.map');

        case 2:
          res = _context.sent;

          expect(res).toBe('bundle.js.map');

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, _this);
})));

test('errors when no source map', _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
  var testFileName;
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          expect.assertions(1);

          testFileName = 'test.js';
          _context2.prev = 2;
          _context2.next = 5;
          return extractSourceMapUrl(testFileName, 'console.log(\'hi\')\n\nconsole.log(\'bye\')');

        case 5:
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2['catch'](2);

          expect(_context2.t0).toBe('Cannot find a source map directive for ' + testFileName + '.');

        case 10:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, _this, [[2, 7]]);
})));