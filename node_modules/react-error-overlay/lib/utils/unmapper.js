import _regeneratorRuntime from 'babel-runtime/regenerator';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Turns a set of mapped <code>StackFrame</code>s back into their generated code position and enhances them with code.
 * @param {string} fileUri The URI of the <code>bundle.js</code> file.
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which are already mapped and missing their generated positions.
 * @param {number} [fileContents=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
var unmap = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(_fileUri, frames) {
    var contextLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    var fileContents, fileUri, map;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileContents = (typeof _fileUri === 'undefined' ? 'undefined' : _typeof(_fileUri)) === 'object' ? _fileUri.contents : null;
            fileUri = (typeof _fileUri === 'undefined' ? 'undefined' : _typeof(_fileUri)) === 'object' ? _fileUri.uri : _fileUri;

            if (!(fileContents == null)) {
              _context.next = 6;
              break;
            }

            _context.next = 5;
            return fetch(fileUri).then(function (res) {
              return res.text();
            });

          case 5:
            fileContents = _context.sent;

          case 6:
            _context.next = 8;
            return getSourceMap(fileUri, fileContents);

          case 8:
            map = _context.sent;
            return _context.abrupt('return', frames.map(function (frame) {
              var functionName = frame.functionName,
                  lineNumber = frame.lineNumber,
                  columnNumber = frame.columnNumber,
                  _originalLineNumber = frame._originalLineNumber;

              if (_originalLineNumber != null) {
                return frame;
              }
              var fileName = frame.fileName;

              if (fileName) {
                fileName = path.normalize(fileName);
              }
              if (fileName == null) {
                return frame;
              }
              var fN = fileName;
              var source = map.getSources().map(function (s) {
                return s.replace(/[\\]+/g, '/');
              }).filter(function (p) {
                p = path.normalize(p);
                var i = p.lastIndexOf(fN);
                return i !== -1 && i === p.length - fN.length;
              }).map(function (p) {
                return {
                  token: p,
                  seps: count(path.sep, path.normalize(p)),
                  penalties: count('node_modules', p) + count('~', p)
                };
              }).sort(function (a, b) {
                var s = Math.sign(a.seps - b.seps);
                if (s !== 0) {
                  return s;
                }
                return Math.sign(a.penalties - b.penalties);
              });
              if (source.length < 1 || lineNumber == null) {
                return new StackFrame(null, null, null, null, null, functionName, fN, lineNumber, columnNumber, null);
              }
              var sourceT = source[0].token;

              var _map$getGeneratedPosi = map.getGeneratedPosition(sourceT, lineNumber,
              // $FlowFixMe
              columnNumber),
                  line = _map$getGeneratedPosi.line,
                  column = _map$getGeneratedPosi.column;

              var originalSource = map.getSource(sourceT);
              return new StackFrame(functionName, fileUri, line, column || null, getLinesAround(line, contextLines, fileContents || []), functionName, fN, lineNumber, columnNumber, getLinesAround(lineNumber, contextLines, originalSource));
            }));

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function unmap(_x2, _x3) {
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
import path from 'path';

function count(search, string) {
  // Count starts at -1 becuse a do-while loop always runs at least once
  var count = -1,
      index = -1;
  do {
    // First call or the while case evaluated true, meaning we have to make
    // count 0 or we found a character
    ++count;
    // Find the index of our search string, starting after the previous index
    index = string.indexOf(search, index + 1);
  } while (index !== -1);
  return count;
}

export { unmap };
export default unmap;