'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scrollPrarent;

var _style = require('../style');

var _style2 = _interopRequireDefault(_style);

var _height = require('./height');

var _height2 = _interopRequireDefault(_height);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scrollPrarent(node) {
  var position = (0, _style2.default)(node, 'position'),
      excludeStatic = position === 'absolute',
      ownerDoc = node.ownerDocument;

  if (position === 'fixed') return ownerDoc || document;

  while ((node = node.parentNode) && node.nodeType !== 9) {

    var isStatic = excludeStatic && (0, _style2.default)(node, 'position') === 'static',
        style = (0, _style2.default)(node, 'overflow') + (0, _style2.default)(node, 'overflow-y') + (0, _style2.default)(node, 'overflow-x');

    if (isStatic) continue;

    if (/(auto|scroll)/.test(style) && (0, _height2.default)(node) < node.scrollHeight) return node;
  }

  return document;
}
module.exports = exports['default'];