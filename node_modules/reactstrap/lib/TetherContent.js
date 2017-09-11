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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactstrapTether = require('reactstrap-tether');

var _reactstrapTether2 = _interopRequireDefault(_reactstrapTether);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  children: _propTypes2.default.node.isRequired,
  className: _propTypes2.default.string,
  arrow: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  isOpen: _propTypes2.default.bool.isRequired,
  toggle: _propTypes2.default.func.isRequired,
  tether: _propTypes2.default.object.isRequired,
  tetherRef: _propTypes2.default.func,
  style: _propTypes2.default.node,
  cssModule: _propTypes2.default.object
};

var defaultProps = {
  isOpen: false,
  tetherRef: function tetherRef() {}
};

var TetherContent = function (_React$Component) {
  _inherits(TetherContent, _React$Component);

  function TetherContent(props) {
    _classCallCheck(this, TetherContent);

    var _this = _possibleConstructorReturn(this, (TetherContent.__proto__ || Object.getPrototypeOf(TetherContent)).call(this, props));

    _this.handleDocumentClick = _this.handleDocumentClick.bind(_this);
    _this.toggle = _this.toggle.bind(_this);
    return _this;
  }

  _createClass(TetherContent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleProps();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen) {
        this.handleProps();
      } else if (this._element) {
        // rerender
        this.renderIntoSubtree();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.hide();
    }
  }, {
    key: 'getTarget',
    value: function getTarget() {
      var target = this.props.tether.target;

      if ((0, _lodash2.default)(target)) {
        return target();
      }

      return target;
    }
  }, {
    key: 'getTetherConfig',
    value: function getTetherConfig() {
      var config = _extends({}, this.props.tether);

      config.element = this._element;
      config.target = this.getTarget();
      return config;
    }
  }, {
    key: 'handleDocumentClick',
    value: function handleDocumentClick(e) {
      var container = this._element;
      if (e.target === container || !container.contains(e.target)) {
        this.toggle();
      }
    }
  }, {
    key: 'handleProps',
    value: function handleProps() {
      if (this.props.isOpen) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      document.removeEventListener('click', this.handleDocumentClick, true);

      if (this._element) {
        document.body.removeChild(this._element);
        _reactDom2.default.unmountComponentAtNode(this._element);
        this._element = null;
      }

      if (this._tether) {
        this._tether.destroy();
        this._tether = null;
        this.props.tetherRef(this._tether);
      }
    }
  }, {
    key: 'show',
    value: function show() {
      document.addEventListener('click', this.handleDocumentClick, true);

      this._element = document.createElement('div');
      this._element.className = this.props.className;
      document.body.appendChild(this._element);
      this.renderIntoSubtree();
      this._tether = new _reactstrapTether2.default(this.getTetherConfig());
      this.props.tetherRef(this._tether);
      this._tether.position();
      this._element.childNodes[0].focus();
    }
  }, {
    key: 'toggle',
    value: function toggle(e) {
      if (this.props.disabled) {
        return e && e.preventDefault();
      }

      return this.props.toggle();
    }
  }, {
    key: 'renderIntoSubtree',
    value: function renderIntoSubtree() {
      _reactDom2.default.unstable_renderSubtreeIntoContainer(this, this.renderChildren(), this._element);
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _props = this.props,
          children = _props.children,
          style = _props.style;

      return _react2.default.cloneElement(children, { style: style });
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return TetherContent;
}(_react2.default.Component);

TetherContent.propTypes = propTypes;
TetherContent.defaultProps = defaultProps;

exports.default = TetherContent;