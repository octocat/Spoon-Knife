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

var _reactTransitionGroup = require('react-transition-group');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FirstChild = function FirstChild(_ref) {
  var children = _ref.children;
  return _react2.default.Children.toArray(children)[0] || null;
};

var propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  closeClassName: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  color: _propTypes2.default.string,
  isOpen: _propTypes2.default.bool,
  toggle: _propTypes2.default.func,
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  transitionAppearTimeout: _propTypes2.default.number,
  transitionEnterTimeout: _propTypes2.default.number,
  transitionLeaveTimeout: _propTypes2.default.number
};

var defaultProps = {
  color: 'success',
  isOpen: true,
  tag: 'div',
  transitionAppearTimeout: 150,
  transitionEnterTimeout: 150,
  transitionLeaveTimeout: 150
};

var Alert = function Alert(props) {
  var className = props.className,
      closeClassName = props.closeClassName,
      cssModule = props.cssModule,
      Tag = props.tag,
      color = props.color,
      isOpen = props.isOpen,
      toggle = props.toggle,
      children = props.children,
      transitionAppearTimeout = props.transitionAppearTimeout,
      transitionEnterTimeout = props.transitionEnterTimeout,
      transitionLeaveTimeout = props.transitionLeaveTimeout,
      attributes = _objectWithoutProperties(props, ['className', 'closeClassName', 'cssModule', 'tag', 'color', 'isOpen', 'toggle', 'children', 'transitionAppearTimeout', 'transitionEnterTimeout', 'transitionLeaveTimeout']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, 'alert', 'alert-' + color, { 'alert-dismissible': toggle }), cssModule);

  var closeClasses = (0, _utils.mapToCssModules)((0, _classnames2.default)('close', closeClassName), cssModule);

  var alert = _react2.default.createElement(
    Tag,
    _extends({}, attributes, { className: classes, role: 'alert' }),
    toggle ? _react2.default.createElement(
      'button',
      { type: 'button', className: closeClasses, 'aria-label': 'Close', onClick: toggle },
      _react2.default.createElement(
        'span',
        { 'aria-hidden': 'true' },
        '\xD7'
      )
    ) : null,
    children
  );

  return _react2.default.createElement(
    _reactTransitionGroup.CSSTransitionGroup,
    {
      component: FirstChild,
      transitionName: {
        appear: 'fade',
        appearActive: 'show',
        enter: 'fade',
        enterActive: 'show',
        leave: 'fade',
        leaveActive: 'out'
      },
      transitionAppear: transitionAppearTimeout > 0,
      transitionAppearTimeout: transitionAppearTimeout,
      transitionEnter: transitionEnterTimeout > 0,
      transitionEnterTimeout: transitionEnterTimeout,
      transitionLeave: transitionLeaveTimeout > 0,
      transitionLeaveTimeout: transitionLeaveTimeout
    },
    isOpen ? alert : null
  );
};

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

exports.default = Alert;