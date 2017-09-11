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
  children: _propTypes2.default.node,
  inline: _propTypes2.default.bool,
  tag: _propTypes2.default.string,
  color: _propTypes2.default.string,
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object
};

var defaultProps = {
  tag: 'small'
};

var FormText = function FormText(props) {
  var className = props.className,
      cssModule = props.cssModule,
      inline = props.inline,
      color = props.color,
      Tag = props.tag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'inline', 'color', 'tag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, !inline ? 'form-text' : false, color ? 'text-' + color : false), cssModule);

  return _react2.default.createElement(Tag, _extends({}, attributes, { className: classes }));
};

FormText.propTypes = propTypes;
FormText.defaultProps = defaultProps;

exports.default = FormText;