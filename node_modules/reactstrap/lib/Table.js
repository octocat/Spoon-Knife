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
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  size: _propTypes2.default.string,
  bordered: _propTypes2.default.bool,
  striped: _propTypes2.default.bool,
  inverse: _propTypes2.default.bool,
  hover: _propTypes2.default.bool,
  reflow: _propTypes2.default.bool,
  responsive: _propTypes2.default.bool,
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  responsiveTag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

var defaultProps = {
  tag: 'table',
  responsiveTag: 'div'
};

var Table = function Table(props) {
  var className = props.className,
      cssModule = props.cssModule,
      size = props.size,
      bordered = props.bordered,
      striped = props.striped,
      inverse = props.inverse,
      hover = props.hover,
      reflow = props.reflow,
      responsive = props.responsive,
      Tag = props.tag,
      ResponsiveTag = props.responsiveTag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'size', 'bordered', 'striped', 'inverse', 'hover', 'reflow', 'responsive', 'tag', 'responsiveTag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, striped ? 'table-striped' : false, inverse ? 'table-inverse' : false, hover ? 'table-hover' : false, reflow ? 'table-reflow' : false), cssModule);

  var table = _react2.default.createElement(Tag, _extends({}, attributes, { className: classes }));

  if (responsive) {
    return _react2.default.createElement(
      ResponsiveTag,
      { className: 'table-responsive' },
      table
    );
  }

  return table;
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

exports.default = Table;