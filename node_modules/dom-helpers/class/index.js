'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasClass = exports.removeClass = exports.addClass = undefined;

var _addClass = require('./addClass');

var _addClass2 = _interopRequireDefault(_addClass);

var _removeClass = require('./removeClass');

var _removeClass2 = _interopRequireDefault(_removeClass);

var _hasClass = require('./hasClass');

var _hasClass2 = _interopRequireDefault(_hasClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.addClass = _addClass2.default;
exports.removeClass = _removeClass2.default;
exports.hasClass = _hasClass2.default;
exports.default = { addClass: _addClass2.default, removeClass: _removeClass2.default, hasClass: _hasClass2.default };