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
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  size: _propTypes2.default.string,
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

var defaultProps = {
  tag: 'ul'
};

var Pagination = function Pagination(props) {
  var className = props.className,
      cssModule = props.cssModule,
      size = props.size,
      Tag = props.tag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'size', 'tag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, 'pagination', _defineProperty({}, 'pagination-' + size, !!size)), cssModule);

  return _react2.default.createElement(Tag, _extends({}, attributes, { className: classes }));
};

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

exports.default = Pagination;