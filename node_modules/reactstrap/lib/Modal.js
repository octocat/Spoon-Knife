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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactTransitionGroup = require('react-transition-group');

var _Fade = require('./Fade');

var _Fade2 = _interopRequireDefault(_Fade);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
  isOpen: _propTypes2.default.bool,
  autoFocus: _propTypes2.default.bool,
  size: _propTypes2.default.string,
  toggle: _propTypes2.default.func,
  keyboard: _propTypes2.default.bool,
  backdrop: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.oneOf(['static'])]),
  onEnter: _propTypes2.default.func,
  onExit: _propTypes2.default.func,
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  wrapClassName: _propTypes2.default.string,
  modalClassName: _propTypes2.default.string,
  backdropClassName: _propTypes2.default.string,
  contentClassName: _propTypes2.default.string,
  fade: _propTypes2.default.bool,
  cssModule: _propTypes2.default.object,
  zIndex: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  backdropTransitionTimeout: _propTypes2.default.number,
  backdropTransitionAppearTimeout: _propTypes2.default.number,
  backdropTransitionEnterTimeout: _propTypes2.default.number,
  backdropTransitionLeaveTimeout: _propTypes2.default.number,
  modalTransitionTimeout: _propTypes2.default.number,
  modalTransitionAppearTimeout: _propTypes2.default.number,
  modalTransitionEnterTimeout: _propTypes2.default.number,
  modalTransitionLeaveTimeout: _propTypes2.default.number
};

var propsToOmit = Object.keys(propTypes);

var defaultProps = {
  isOpen: false,
  autoFocus: true,
  backdrop: true,
  keyboard: true,
  zIndex: 1050,
  fade: true,
  modalTransitionTimeout: 300,
  backdropTransitionTimeout: 150
};

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal(props) {
    _classCallCheck(this, Modal);

    var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, props));

    _this.originalBodyPadding = null;
    _this.isBodyOverflowing = false;
    _this.togglePortal = _this.togglePortal.bind(_this);
    _this.handleBackdropClick = _this.handleBackdropClick.bind(_this);
    _this.handleEscape = _this.handleEscape.bind(_this);
    _this.destroy = _this.destroy.bind(_this);
    _this.onEnter = _this.onEnter.bind(_this);
    _this.onExit = _this.onExit.bind(_this);
    return _this;
  }

  _createClass(Modal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.isOpen) {
        this.togglePortal();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen) {
        // handle portal events/dom updates
        this.togglePortal();
      } else if (this._element) {
        // rerender portal
        this.renderIntoSubtree();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.onExit();
    }
  }, {
    key: 'onEnter',
    value: function onEnter() {
      if (this.props.onEnter) {
        this.props.onEnter();
      }
    }
  }, {
    key: 'onExit',
    value: function onExit() {
      this.destroy();
      if (this.props.onExit) {
        this.props.onExit();
      }
    }
  }, {
    key: 'handleEscape',
    value: function handleEscape(e) {
      if (this.props.keyboard && e.keyCode === 27 && this.props.toggle) {
        this.props.toggle();
      }
    }
  }, {
    key: 'handleBackdropClick',
    value: function handleBackdropClick(e) {
      if (this.props.backdrop !== true) return;

      var container = this._dialog;

      if (e.target && !container.contains(e.target) && this.props.toggle) {
        this.props.toggle();
      }
    }
  }, {
    key: 'hasTransition',
    value: function hasTransition() {
      if (this.props.fade === false) {
        return false;
      }

      return this.props.modalTransitionTimeout > 0;
    }
  }, {
    key: 'togglePortal',
    value: function togglePortal() {
      if (this.props.isOpen) {
        if (this.props.autoFocus) {
          this._focus = true;
        }
        this.show();
        if (!this.hasTransition()) {
          this.onEnter();
        }
      } else {
        this.hide();
        if (!this.hasTransition()) {
          this.onExit();
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this._element) {
        _reactDom2.default.unmountComponentAtNode(this._element);
        document.body.removeChild(this._element);
        this._element = null;
      }

      // Use regex to prevent matching `modal-open` as part of a different class, e.g. `my-modal-opened`
      var classes = document.body.className.replace(/(^| )modal-open( |$)/, ' ');
      document.body.className = (0, _utils.mapToCssModules)((0, _classnames2.default)(classes).trim(), this.props.cssModule);
      (0, _utils.setScrollbarWidth)(this.originalBodyPadding);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.renderIntoSubtree();
    }
  }, {
    key: 'show',
    value: function show() {
      var classes = document.body.className;
      this._element = document.createElement('div');
      this._element.setAttribute('tabindex', '-1');
      this._element.style.position = 'relative';
      this._element.style.zIndex = this.props.zIndex;
      this.originalBodyPadding = (0, _utils.getOriginalBodyPadding)();

      (0, _utils.conditionallyUpdateScrollbar)();

      document.body.appendChild(this._element);

      document.body.className = (0, _utils.mapToCssModules)((0, _classnames2.default)(classes, 'modal-open'), this.props.cssModule);

      this.renderIntoSubtree();
    }
  }, {
    key: 'renderModalDialog',
    value: function renderModalDialog() {
      var _this2 = this;

      var attributes = (0, _utils.omit)(this.props, propsToOmit);

      return _react2.default.createElement(
        'div',
        _extends({
          className: (0, _utils.mapToCssModules)((0, _classnames2.default)('modal-dialog', this.props.className, _defineProperty({}, 'modal-' + this.props.size, this.props.size)), this.props.cssModule),
          role: 'document',
          ref: function ref(c) {
            return _this2._dialog = c;
          }
        }, attributes),
        _react2.default.createElement(
          'div',
          {
            className: (0, _utils.mapToCssModules)((0, _classnames2.default)('modal-content', this.props.contentClassName), this.props.cssModule)
          },
          this.props.children
        )
      );
    }
  }, {
    key: 'renderIntoSubtree',
    value: function renderIntoSubtree() {
      _reactDom2.default.unstable_renderSubtreeIntoContainer(this, this.renderChildren(), this._element);

      // check if modal should receive focus
      if (this._focus) {
        this._dialog.parentNode.focus();
        this._focus = false;
      }
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _props = this.props,
          wrapClassName = _props.wrapClassName,
          modalClassName = _props.modalClassName,
          backdropClassName = _props.backdropClassName,
          cssModule = _props.cssModule,
          isOpen = _props.isOpen,
          backdrop = _props.backdrop,
          modalTransitionTimeout = _props.modalTransitionTimeout,
          backdropTransitionTimeout = _props.backdropTransitionTimeout;


      var modalAttributes = {
        onClickCapture: this.handleBackdropClick,
        onKeyUp: this.handleEscape,
        style: { display: 'block' },
        tabIndex: '-1'
      };

      if (this.hasTransition()) {
        return _react2.default.createElement(
          _reactTransitionGroup.TransitionGroup,
          { component: 'div', className: (0, _utils.mapToCssModules)(wrapClassName) },
          isOpen && _react2.default.createElement(
            _Fade2.default,
            _extends({
              key: 'modal-dialog',
              onEnter: this.onEnter,
              onLeave: this.onExit,
              transitionAppearTimeout: typeof this.props.modalTransitionAppearTimeout === 'number' ? this.props.modalTransitionAppearTimeout : modalTransitionTimeout,
              transitionEnterTimeout: typeof this.props.modalTransitionEnterTimeout === 'number' ? this.props.modalTransitionEnterTimeout : modalTransitionTimeout,
              transitionLeaveTimeout: typeof this.props.modalTransitionLeaveTimeout === 'number' ? this.props.modalTransitionLeaveTimeout : modalTransitionTimeout,
              cssModule: cssModule,
              className: (0, _utils.mapToCssModules)((0, _classnames2.default)('modal', modalClassName), cssModule)
            }, modalAttributes),
            this.renderModalDialog()
          ),
          isOpen && backdrop && _react2.default.createElement(_Fade2.default, {
            key: 'modal-backdrop',
            transitionAppearTimeout: typeof this.props.backdropTransitionAppearTimeout === 'number' ? this.props.backdropTransitionAppearTimeout : backdropTransitionTimeout,
            transitionEnterTimeout: typeof this.props.backdropTransitionEnterTimeout === 'number' ? this.props.backdropTransitionEnterTimeout : backdropTransitionTimeout,
            transitionLeaveTimeout: typeof this.props.backdropTransitionLeaveTimeout === 'number' ? this.props.backdropTransitionLeaveTimeout : backdropTransitionTimeout,
            cssModule: cssModule,
            className: (0, _utils.mapToCssModules)((0, _classnames2.default)('modal-backdrop', backdropClassName), cssModule)
          })
        );
      }

      return _react2.default.createElement(
        'div',
        { className: (0, _utils.mapToCssModules)(wrapClassName) },
        isOpen && _react2.default.createElement(
          'div',
          _extends({
            className: (0, _utils.mapToCssModules)((0, _classnames2.default)('modal', 'show', modalClassName), cssModule)
          }, modalAttributes),
          this.renderModalDialog()
        ),
        isOpen && backdrop && _react2.default.createElement('div', {
          className: (0, _utils.mapToCssModules)((0, _classnames2.default)('modal-backdrop', 'show', backdropClassName), cssModule)
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Modal;
}(_react2.default.Component);

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

exports.default = Modal;