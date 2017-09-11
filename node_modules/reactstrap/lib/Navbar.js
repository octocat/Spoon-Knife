'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var propTypes = {
  light: _propTypes2.default.bool,
  inverse: _propTypes2.default.bool,
  full: _propTypes2.default.bool,
  fixed: _propTypes2.default.string,
  sticky: _propTypes2.default.string,
  color: _propTypes2.default.string,
  role: _propTypes2.default.string,
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  toggleable: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string])
};

var defaultProps = {
  tag: 'nav',
  toggleable: false
};

var getToggleableClass = function getToggleableClass(toggleable) {
  if (toggleable === false) {
    return false;
  } else if (toggleable === true || toggleable === 'xs') {
    return 'navbar-toggleable';
  }

  return 'navbar-toggleable-' + toggleable;
};

var Navbar = function Navbar(props) {
  var _classNames;

  var toggleable = props.toggleable,
      className = props.className,
      cssModule = props.cssModule,
      light = props.light,
      inverse = props.inverse,
      full = props.full,
      fixed = props.fixed,
      sticky = props.sticky,
      color = props.color,
      Tag = props.tag,
      attributes = _objectWithoutProperties(props, ['toggleable', 'className', 'cssModule', 'light', 'inverse', 'full', 'fixed', 'sticky', 'color', 'tag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, 'navbar', getToggleableClass(toggleable), (_classNames = {
    'navbar-light': light,
    'navbar-inverse': inverse
  }, _defineProperty(_classNames, 'bg-' + color, color), _defineProperty(_classNames, 'navbar-full', full), _defineProperty(_classNames, 'fixed-' + fixed, fixed), _defineProperty(_classNames, 'sticky-' + sticky, sticky), _classNames)), cssModule);

  return _react2.default.createElement(Tag, _extends({}, attributes, { className: classes }));
};

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

exports.default = Navbar;