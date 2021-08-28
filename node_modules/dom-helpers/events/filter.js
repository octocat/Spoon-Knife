'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterEvents;

var _contains = require('../query/contains');

var _contains2 = _interopRequireDefault(_contains);

var _querySelectorAll = require('../query/querySelectorAll');

var _querySelectorAll2 = _interopRequireDefault(_querySelectorAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filterEvents(selector, handler) {
  return function filterHandler(e) {
    var top = e.currentTarget,
        target = e.target,
        matches = (0, _querySelectorAll2.default)(top, selector);

    if (matches.some(function (match) {
      return (0, _contains2.default)(match, target);
    })) handler.call(this, e);
  };
}
module.exports = exports['default'];