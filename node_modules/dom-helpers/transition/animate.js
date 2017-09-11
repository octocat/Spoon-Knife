'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _hyphenate = require('../util/hyphenate');

var _hyphenate2 = _interopRequireDefault(_hyphenate);

var _style = require('../style');

var _style2 = _interopRequireDefault(_style);

var _on = require('../events/on');

var _on2 = _interopRequireDefault(_on);

var _off = require('../events/off');

var _off2 = _interopRequireDefault(_off);

var _properties = require('./properties');

var _properties2 = _interopRequireDefault(_properties);

var _isTransform = require('./isTransform');

var _isTransform2 = _interopRequireDefault(_isTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reset = {};
reset[_properties2.default.property] = reset[_properties2.default.duration] = reset[_properties2.default.delay] = reset[_properties2.default.timing] = '';

// super lean animate function for transitions
// doesn't support all translations to keep it matching the jquery API
/**
 * code in part from: Zepto 1.1.4 | zeptojs.com/license
 */
function _animate(_ref) {
  var node = _ref.node;
  var properties = _ref.properties;
  var _ref$duration = _ref.duration;
  var duration = _ref$duration === undefined ? 200 : _ref$duration;
  var easing = _ref.easing;
  var callback = _ref.callback;

  var cssProperties = [],
      fakeEvent = { target: node, currentTarget: node },
      cssValues = {},
      transforms = '',
      fired = void 0;

  if (!_properties2.default.end) duration = 0;

  Object.keys(properties).forEach(function (key) {
    if ((0, _isTransform2.default)(key)) transforms += key + '(' + properties[key] + ') ';else {
      cssValues[key] = properties[key];
      cssProperties.push((0, _hyphenate2.default)(key));
    }
  });

  if (transforms) {
    cssValues[_properties2.default.transform] = transforms;
    cssProperties.push(_properties2.default.transform);
  }

  if (duration > 0) {
    cssValues[_properties2.default.property] = cssProperties.join(', ');
    cssValues[_properties2.default.duration] = duration / 1000 + 's';
    cssValues[_properties2.default.delay] = 0 + 's';
    cssValues[_properties2.default.timing] = easing || 'linear';

    (0, _on2.default)(node, _properties2.default.end, done);

    setTimeout(function () {
      if (!fired) done(fakeEvent);
    }, duration + 500);
  }

  //eslint-disable-next-line no-unused-expressions
  node.clientLeft; // trigger page reflow

  (0, _style2.default)(node, cssValues);

  if (duration <= 0) setTimeout(done.bind(null, fakeEvent), 0);

  return {
    cancel: function cancel() {
      if (fired) return;
      fired = true;
      (0, _off2.default)(node, _properties2.default.end, done);
      (0, _style2.default)(node, reset);
    }
  };

  function done(event) {
    if (event.target !== event.currentTarget) return;

    fired = true;
    (0, _off2.default)(event.target, _properties2.default.end, done);
    (0, _style2.default)(node, reset);
    callback && callback.call(this);
  }
}

function animate(node, properties, duration, easing, callback) {
  if (arguments.length === 1 && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object') {
    return _animate(node);
  }

  if (typeof easing === 'function') {
    callback = easing;
    easing = null;
  }

  return _animate({ node: node, properties: properties, duration: duration, easing: easing, callback: callback });
}

exports.default = animate;
module.exports = exports['default'];