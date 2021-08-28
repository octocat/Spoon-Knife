'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TetherContent = require('./TetherContent');

var _TetherContent2 = _interopRequireDefault(_TetherContent);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  placement: _propTypes2.default.oneOf(_utils.tetherAttachements),
  target: _propTypes2.default.string.isRequired,
  isOpen: _propTypes2.default.bool,
  tether: _propTypes2.default.object,
  tetherRef: _propTypes2.default.func,
  className: _propTypes2.default.string,
  cssModule: _propTypes2.default.object,
  toggle: _propTypes2.default.func
};

var defaultProps = {
  isOpen: false,
  placement: 'bottom',
  toggle: function toggle() {}
};

var defaultTetherConfig = {
  classPrefix: 'bs-tether',
  classes: {
    element: false,
    enabled: 'show'
  },
  constraints: [{ to: 'scrollParent', attachment: 'together none' }, { to: 'window', attachment: 'together none' }]
};

var Popover = function (_React$Component) {
  _inherits(Popover, _React$Component);

  function Popover(props) {
    _classCallCheck(this, Popover);

    var _this = _possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).call(this, props));

    _this.getTetherConfig = _this.getTetherConfig.bind(_this);
    return _this;
  }

  _createClass(Popover, [{
    key: 'getTetherConfig',
    value: function getTetherConfig() {
      var attachments = (0, _utils.getTetherAttachments)(this.props.placement);
      return _extends({}, defaultTetherConfig, attachments, {
        target: '#' + this.props.target
      }, this.props.tether);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.isOpen) {
        return null;
      }

      var tetherConfig = this.getTetherConfig();

      var classes = (0, _utils.mapToCssModules)((0, _classnames2.default)('popover-inner', this.props.className), this.props.cssModule);

      var attributes = (0, _utils.omit)(this.props, Object.keys(propTypes));

      return _react2.default.createElement(
        _TetherContent2.default,
        {
          className: (0, _utils.mapToCssModules)('popover', this.props.cssModule),
          tether: tetherConfig,
          tetherRef: this.props.tetherRef,
          isOpen: this.props.isOpen,
          toggle: this.props.toggle
        },
        _react2.default.createElement('div', _extends({}, attributes, { className: classes }))
      );
    }
  }]);

  return Popover;
}(_react2.default.Component);

Popover.propTypes = propTypes;
Popover.defaultProps = defaultProps;

exports.default = Popover;