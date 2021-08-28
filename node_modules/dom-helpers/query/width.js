'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = width;

var _offset = require('./offset');

var _offset2 = _interopRequireDefault(_offset);

var _isWindow = require('./isWindow');

var _isWindow2 = _interopRequireDefault(_isWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function width(node, client) {
  var win = (0, _isWindow2.default)(node);
  return win ? win.innerWidth : client ? node.clientWidth : (0, _offset2.default)(node).width;
}
module.exports = exports['default'];