'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = TabPane;

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
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  tabId: _propTypes2.default.any
};

var defaultProps = {
  tag: 'div'
};

var contextTypes = {
  activeTabId: _propTypes2.default.any
};

function TabPane(props, context) {
  var className = props.className,
      cssModule = props.cssModule,
      tabId = props.tabId,
      Tag = props.tag,
      attributes = _objectWithoutProperties(props, ['className', 'cssModule', 'tabId', 'tag']);

  var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)('tab-pane', className, { active: tabId === context.activeTabId }), cssModule);
  return _react2.default.createElement(Tag, _extends({}, attributes, { className: classes }));
}
TabPane.propTypes = propTypes;
TabPane.defaultProps = defaultProps;
TabPane.contextTypes = contextTypes;