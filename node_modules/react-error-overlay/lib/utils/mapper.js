import _regeneratorRuntime from 'babel-runtime/regenerator';

/**
 * Enhances a set of <code>StackFrame</code>s with their original positions and code (when available).
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which contain (generated) code positions.
 * @param {number} [contextLines=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
var map = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(frames) {
    var _this = this;

    var contextLines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    var cache, files;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cache = {};
            files = [];

            frames.forEach(function (frame) {
              var fileName = frame.fileName;

              if (fileName == null) {
                return;
              }
              if (files.indexOf(fileName) !== -1) {
                return;
              }
              files.push(fileName);
            });
            _context2.next = 5;
            return settle(files.map(function () {
              var _ref2 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(fileName) {
                var fileSource, map;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return fetch(fileName).then(function (r) {
                          return r.text();
                        });

                      case 2:
                        fileSource = _context.sent;
                        _context.next = 5;
                        return getSourceMap(fileName, fileSource);

                      case 5:
                        map = _context.sent;

                        cache[fileName] = { fileSource: fileSource, map: map };

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 5:
            return _context2.abrupt('return', frames.map(function (frame) {
              var functionName = frame.functionName,
                  fileName = frame.fileName,
                  lineNumber = frame.lineNumber,
                  columnNumber = frame.columnNumber;

              var _ref3 = cache[fileName] || {},
                  map = _ref3.map,
                  fileSource = _ref3.fileSource;

              if (map == null || lineNumber == null) {
                return frame;
              }

              var _map$getOriginalPosit = map.getOriginalPosition(lineNumber, columnNumber),
                  source = _map$getOriginalPosit.source,
                  line = _map$getOriginalPosit.line,
                  column = _map$getOriginalPosit.column;

              var originalSource = source == null ? [] : map.getSource(source);
              return new StackFrame(functionName, fileName, lineNumber, columnNumber, getLinesAround(lineNumber, contextLines, fileSource), functionName, source, line, column, getLinesAround(line, contextLines, originalSource));
            }));

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function map(_x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import StackFrame from './stack-frame';
import { getSourceMap } from './getSourceMap';
import { getLinesAround } from './getLinesAround';
import { settle } from 'settle-promise';

export { map };
export default map;