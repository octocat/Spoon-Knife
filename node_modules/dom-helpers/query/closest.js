'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = closest;

var _matches = require('./matches');

var _matches2 = _interopRequireDefault(_matches);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDoc = function isDoc(obj) {
  return obj != null && obj.nodeType === obj.DOCUMENT_NODE;
};

function closest(node, selector, context) {
  while (node && (isDoc(node) || !(0, _matches2.default)(node, selector))) {
    node = node !== context && !isDoc(node) ? node.parentNode : undefined;
  }
  return node;
}
module.exports = exports['default'];