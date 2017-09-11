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
  'aria-label': _propTypes2.default.string,
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  next: _propTypes2.default.bool,
  previous: _propTypes2.default.bool,
  tag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

var defaultProps = {
  tag: 'a'
};

var PaginationLink = function PaginationLink(props) {
  var className = props.className,
      cssModule = props.cssModule,
      next = props.next,
      previous = props.previous,
      Tag = props.tag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'next', 'previous', 'tag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)(className, 'page-link'), cssModule);

  var defaultAriaLabel = void 0;
  if (previous) {
    defaultAriaLabel = 'Previous';
  } else if (next) {
    defaultAriaLabel = 'Next';
  }
  var ariaLabel = props['aria-label'] || defaultAriaLabel;

  var defaultCaret = void 0;
  if (previous) {
    defaultCaret = '\xAB';
  } else if (next) {
    defaultCaret = '\xBB';
  }

  var children = props.children;
  if (previous || next) {
    children = [_react2.default.createElement(
      'span',
      {
        'aria-hidden': 'true',
        key: 'caret'
      },
      children || defaultCaret
    ), _react2.default.createElement(
      'span',
      {
        className: 'sr-only',
        key: 'sr'
      },
      ariaLabel
    )];
  }

  return _react2.default.createElement(
    Tag,
    _extends({}, attributes, {
      className: classes,
      'aria-label': ariaLabel
    }),
    children
  );
};

PaginationLink.propTypes = propTypes;
PaginationLink.defaultProps = defaultProps;

exports.default = PaginationLink;