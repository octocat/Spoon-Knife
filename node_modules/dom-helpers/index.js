'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestAnimationFrame = exports.ownerWindow = exports.ownerDocument = exports.activeElement = exports.query = exports.events = exports.style = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var _activeElement = require('./activeElement');

var _activeElement2 = _interopRequireDefault(_activeElement);

var _ownerDocument = require('./ownerDocument');

var _ownerDocument2 = _interopRequireDefault(_ownerDocument);

var _ownerWindow = require('./ownerWindow');

var _ownerWindow2 = _interopRequireDefault(_ownerWindow);

var _requestAnimationFrame = require('./util/requestAnimationFrame');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.style = _style2.default;
exports.events = _events2.default;
exports.query = _query2.default;
exports.activeElement = _activeElement2.default;
exports.ownerDocument = _ownerDocument2.default;
exports.ownerWindow = _ownerWindow2.default;
exports.requestAnimationFrame = _requestAnimationFrame2.default;
exports.default = _extends({}, _events2.default, _query2.default, {
  style: _style2.default,
  activeElement: _activeElement2.default,
  ownerDocument: _ownerDocument2.default,
  ownerWindow: _ownerWindow2.default,
  requestAnimationFrame: _requestAnimationFrame2.default
});