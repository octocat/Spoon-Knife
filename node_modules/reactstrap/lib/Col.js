'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash.isobject');

var _lodash2 = _interopRequireDefault(_lodash);

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

var colWidths = ['xs', 'sm', 'md', 'lg', 'xl'];
var stringOrNumberProp = _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]);

var columnProps = _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.shape({
  size: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number, _propTypes2.default.string]),
  push: stringOrNumberProp,
  pull: stringOrNumberProp,
  offset: stringOrNumberProp
})]);

var propTypes = {
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  widths: _propTypes2.default.array
};

var defaultProps = {
  tag: 'div',
  widths: colWidths
};

var getColumnSizeClass = function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : 'col-' + colWidth;
  } else if (colSize === 'auto') {
    return isXs ? 'col-auto' : 'col-' + colWidth + '-auto';
  }

  return isXs ? 'col-' + colSize : 'col-' + colWidth + '-' + colSize;
};

var Col = function Col(props) {
  var className = props.className,
      cssModule = props.cssModule,
      widths = props.widths,
      Tag = props.tag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'widths', 'tag']);

  var colClasses = [];

  widths.forEach(function (colWidth, i) {
    var columnProp = props[colWidth];

    if (!i && columnProp === undefined) {
      columnProp = true;
    }

    delete attributes[colWidth];

    if (!columnProp) {
      return;
    }

    var isXs = !i;
    var colClass = void 0;

    if ((0, _lodash2.default)(columnProp)) {
      var _classNames;

      var colSizeInterfix = isXs ? '-' : '-' + colWidth + '-';
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      colClasses.push((0, _utils.mapToCssModules)((0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, colClass, columnProp.size || columnProp.size === ''), _defineProperty(_classNames, 'push' + colSizeInterfix + columnProp.push, columnProp.push || columnProp.push === 0), _defineProperty(_classNames, 'pull' + colSizeInterfix + columnProp.pull, columnProp.pull || columnProp.pull === 0), _defineProperty(_classNames, 'offset' + colSizeInterfix + columnProp.offset, columnProp.offset || columnProp.offset === 0), _classNames))), cssModule);
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, colClasses), cssModule);

  return _react2.default.createElement(Tag, _extends({}, attributes, { className: classes }));
};

Col.propTypes = propTypes;
Col.defaultProps = defaultProps;

exports.default = Col;