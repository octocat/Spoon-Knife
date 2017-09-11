import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/**
 * Returns an instance of <code>{@link SourceMap}</code> for a given fileUri and fileContents.
 * @param {string} fileUri The URI of the source file.
 * @param {string} fileContents The contents of the source file.
 */
var getSourceMap = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(fileUri, fileContents) {
    var sm, base64, match2, index, url, obj;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return extractSourceMapUrl(fileUri, fileContents);

          case 2:
            sm = _context.sent;

            if (!(sm.indexOf('data:') === 0)) {
              _context.next = 14;
              break;
            }

            base64 = /^data:application\/json;([\w=:"-]+;)*base64,/;
            match2 = sm.match(base64);

            if (match2) {
              _context.next = 8;
              break;
            }

            throw new Error('Sorry, non-base64 inline source-map encoding is not supported.');

          case 8:
            sm = sm.substring(match2[0].length);
            sm = window.atob(sm);
            sm = JSON.parse(sm);
            return _context.abrupt('return', new SourceMap(new SourceMapConsumer(sm)));

          case 14:
            index = fileUri.lastIndexOf('/');
            url = fileUri.substring(0, index + 1) + sm;
            _context.next = 18;
            return fetch(url).then(function (res) {
              return res.json();
            });

          case 18:
            obj = _context.sent;
            return _context.abrupt('return', new SourceMap(new SourceMapConsumer(obj)));

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getSourceMap(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { SourceMapConsumer } from 'source-map';

/**
 * A wrapped instance of a <code>{@link https://github.com/mozilla/source-map SourceMapConsumer}</code>.
 *
 * This exposes methods which will be indifferent to changes made in <code>{@link https://github.com/mozilla/source-map source-map}</code>.
 */

var SourceMap = function () {
  function SourceMap(sourceMap) {
    _classCallCheck(this, SourceMap);

    this.__source_map = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   */


  _createClass(SourceMap, [{
    key: 'getOriginalPosition',
    value: function getOriginalPosition(line, column) {
      var _source_map$original = this.__source_map.originalPositionFor({
        line: line,
        column: column
      }),
          l = _source_map$original.line,
          c = _source_map$original.column,
          s = _source_map$original.source;

      return { line: l, column: c, source: s };
    }

    /**
     * Returns the generated code position for an original position.
     * @param {string} source The source file of the original code position.
     * @param {number} line The line of the original code position.
     * @param {number} column The column of the original code position.
     */

  }, {
    key: 'getGeneratedPosition',
    value: function getGeneratedPosition(source, line, column) {
      var _source_map$generate = this.__source_map.generatedPositionFor({
        source: source,
        line: line,
        column: column
      }),
          l = _source_map$generate.line,
          c = _source_map$generate.column;

      return {
        line: l,
        column: c
      };
    }

    /**
     * Returns the code for a given source file name.
     * @param {string} sourceName The name of the source file.
     */

  }, {
    key: 'getSource',
    value: function getSource(sourceName) {
      return this.__source_map.sourceContentFor(sourceName);
    }
  }, {
    key: 'getSources',
    value: function getSources() {
      return this.__source_map.sources;
    }
  }]);

  return SourceMap;
}();

function extractSourceMapUrl(fileUri, fileContents) {
  var regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  var match = null;
  for (;;) {
    var next = regex.exec(fileContents);
    if (next == null) {
      break;
    }
    match = next;
  }
  if (!(match && match[1])) {
    return Promise.reject('Cannot find a source map directive for ' + fileUri + '.');
  }
  return Promise.resolve(match[1].toString());
}

export { extractSourceMapUrl, getSourceMap };
export default getSourceMap;