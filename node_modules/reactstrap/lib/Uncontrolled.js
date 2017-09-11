'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UncontrolledTooltip = exports.UncontrolledNavDropdown = exports.UncontrolledDropdown = exports.UncontrolledButtonDropdown = exports.UncontrolledAlert = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Alert = require('./Alert');

var _Alert2 = _interopRequireDefault(_Alert);

var _ButtonDropdown = require('./ButtonDropdown');

var _ButtonDropdown2 = _interopRequireDefault(_ButtonDropdown);

var _Dropdown = require('./Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _NavDropdown = require('./NavDropdown');

var _NavDropdown2 = _interopRequireDefault(_NavDropdown);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var components = {
  UncontrolledAlert: _Alert2.default,
  UncontrolledButtonDropdown: _ButtonDropdown2.default,
  UncontrolledDropdown: _Dropdown2.default,
  UncontrolledNavDropdown: _NavDropdown2.default,
  UncontrolledTooltip: _Tooltip2.default
};

Object.keys(components).forEach(function (key) {
  var Tag = components[key];
  var defaultValue = Tag === _Alert2.default;

  var Uncontrolled = function (_Component) {
    _inherits(Uncontrolled, _Component);

    function Uncontrolled(props) {
      _classCallCheck(this, Uncontrolled);

      var _this = _possibleConstructorReturn(this, (Uncontrolled.__proto__ || Object.getPrototypeOf(Uncontrolled)).call(this, props));

      _this.state = { isOpen: defaultValue };

      _this.toggle = _this.toggle.bind(_this);
      return _this;
    }

    _createClass(Uncontrolled, [{
      key: 'toggle',
      value: function toggle() {
        this.setState({ isOpen: !this.state.isOpen });
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Tag, _extends({ isOpen: this.state.isOpen, toggle: this.toggle }, this.props));
      }
    }]);

    return Uncontrolled;
  }(Component);

  Uncontrolled.displayName = key;

  components[key] = Uncontrolled;
});

var UncontrolledAlert = components.UncontrolledAlert;
var UncontrolledButtonDropdown = components.UncontrolledButtonDropdown;
var UncontrolledDropdown = components.UncontrolledDropdown;
var UncontrolledNavDropdown = components.UncontrolledNavDropdown;
var UncontrolledTooltip = components.UncontrolledTooltip;

exports.UncontrolledAlert = UncontrolledAlert;
exports.UncontrolledButtonDropdown = UncontrolledButtonDropdown;
exports.UncontrolledDropdown = UncontrolledDropdown;
exports.UncontrolledNavDropdown = UncontrolledNavDropdown;
exports.UncontrolledTooltip = UncontrolledTooltip;