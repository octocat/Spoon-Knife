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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var propTypes = {
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  wrapTag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  toggle: _propTypes2.default.func,
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  children: _propTypes2.default.node
};

var defaultProps = {
  tag: 'h4',
  wrapTag: 'div'
};

var ModalHeader = function ModalHeader(props) {
  var closeButton = void 0;

  var className = props.className,
      cssModule = props.cssModule,
      children = props.children,
      toggle = props.toggle,
      Tag = props.tag,
      WrapTag = props.wrapTag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'children', 'toggle', 'tag', 'wrapTag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, 'modal-header'), cssModule);

  if (toggle) {
    closeButton = _react2.default.createElement(
      'button',
      { type: 'button', onClick: toggle, className: 'close', 'aria-label': 'Close' },
      _react2.default.createElement(
        'span',
        { 'aria-hidden': 'true' },
        String.fromCharCode(215)
      )
    );
  }

  return _react2.default.createElement(
    WrapTag,
    _extends({}, attributes, { className: classes }),
    _react2.default.createElement(
      Tag,
      { className: (0, _utils.mapToCssModules)('modal-title', cssModule) },
      children
    ),
    closeButton
  );
};

ModalHeader.propTypes = propTypes;
ModalHeader.defaultProps = defaultProps;

exports.default = ModalHeader;