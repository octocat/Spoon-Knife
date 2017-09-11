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

import { map } from '../utils/mapper';
import { parse } from '../utils/parser';
import fs from 'fs';
import { resolve } from 'path';

test('basic error; 0 context', _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
  var error, frames;
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          expect.assertions(1);
          error = 'TypeError: document.body.missing is not a function\n    at App.componentDidMount (http://localhost:3000/static/js/bundle.js:26122:21)\n    at http://localhost:3000/static/js/bundle.js:30091:25\n    at measureLifeCyclePerf (http://localhost:3000/static/js/bundle.js:29901:12)\n    at http://localhost:3000/static/js/bundle.js:30090:11\n    at CallbackQueue.notifyAll (http://localhost:3000/static/js/bundle.js:13256:22)\n    at ReactReconcileTransaction.close (http://localhost:3000/static/js/bundle.js:35124:26)\n    at ReactReconcileTransaction.closeAll (http://localhost:3000/static/js/bundle.js:7390:25)\n    at ReactReconcileTransaction.perform (http://localhost:3000/static/js/bundle.js:7337:16)\n    at batchedMountComponentIntoNode (http://localhost:3000/static/js/bundle.js:14204:15)\n    at ReactDefaultBatchingStrategyTransaction.perform (http://localhost:3000/static/js/bundle.js:7324:20)\n    at Object.batchedUpdates (http://localhost:3000/static/js/bundle.js:33900:26)\n    at Object.batchedUpdates (http://localhost:3000/static/js/bundle.js:2181:27)\n    at Object._renderNewRootComponent (http://localhost:3000/static/js/bundle.js:14398:18)\n    at Object._renderSubtreeIntoContainer (http://localhost:3000/static/js/bundle.js:14479:32)\n    at Object.render (http://localhost:3000/static/js/bundle.js:14500:23)\n    at Object.friendlySyntaxErrorLabel (http://localhost:3000/static/js/bundle.js:17287:20)\n    at __webpack_require__ (http://localhost:3000/static/js/bundle.js:660:30)\n    at fn (http://localhost:3000/static/js/bundle.js:84:20)\n    at Object.<anonymous> (http://localhost:3000/static/js/bundle.js:41219:18)\n    at __webpack_require__ (http://localhost:3000/static/js/bundle.js:660:30)\n    at validateFormat (http://localhost:3000/static/js/bundle.js:709:39)\n    at http://localhost:3000/static/js/bundle.js:712:10';


          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs')).toString('utf8'));
          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs.map')).toString('utf8'));
          _context.next = 6;
          return map(parse(error), 0);

        case 6:
          frames = _context.sent;

          expect(frames).toEqual(JSON.parse(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.json')).toString('utf8')));

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, _this);
})));

test('default context (3)', _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
  var error, frames;
  return _regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          expect.assertions(1);
          error = 'TypeError: document.body.missing is not a function\n    at App.componentDidMount (http://localhost:3000/static/js/bundle.js:26122:21)';


          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs')).toString('utf8'));
          fetch.mockResponseOnce(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle.mjs.map')).toString('utf8'));
          _context2.next = 6;
          return map(parse(error));

        case 6:
          frames = _context2.sent;

          expect(frames).toEqual(JSON.parse(fs.readFileSync(resolve(__dirname, '../../fixtures/bundle-default.json')).toString('utf8')));

        case 8:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, _this);
})));

test('bad comes back same', _asyncToGenerator(_regeneratorRuntime.mark(function _callee3() {
  var error, orig, frames;
  return _regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          expect.assertions(2);
          error = 'TypeError: document.body.missing is not a function\n    at App.componentDidMount (A:1:2)';
          orig = parse(error);

          expect(orig).toEqual([{
            _originalColumnNumber: null,
            _originalFileName: null,
            _originalFunctionName: null,
            _originalLineNumber: null,
            _originalScriptCode: null,
            _scriptCode: null,
            columnNumber: 2,
            fileName: 'A',
            functionName: 'App.componentDidMount',
            lineNumber: 1
          }]);
          _context3.next = 6;
          return map(orig);

        case 6:
          frames = _context3.sent;

          expect(frames).toEqual(orig);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, _this);
})));