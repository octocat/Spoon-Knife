'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OldValue = require('../old-value');
var Value = require('../value');
var utils = require('../utils');

var OldFilterValue = function (_OldValue) {
    _inherits(OldFilterValue, _OldValue);

    function OldFilterValue() {
        _classCallCheck(this, OldFilterValue);

        return _possibleConstructorReturn(this, _OldValue.apply(this, arguments));
    }

    /**
     * Clean -webkit-filter from properties list
     */
    OldFilterValue.prototype.clean = function clean(decl) {
        var _this2 = this;

        decl.value = utils.editList(decl.value, function (props) {
            if (props.every(function (i) {
                return i.indexOf(_this2.unprefixed) !== 0;
            })) {
                return props;
            }
            return props.filter(function (i) {
                return i.indexOf(_this2.prefixed) === -1;
            });
        });
    };

    return OldFilterValue;
}(OldValue);

var FilterValue = function (_Value) {
    _inherits(FilterValue, _Value);

    function FilterValue(name, prefixes) {
        _classCallCheck(this, FilterValue);

        var _this3 = _possibleConstructorReturn(this, _Value.call(this, name, prefixes));

        if (name === 'filter-function') {
            _this3.name = 'filter';
        }
        return _this3;
    }

    /**
     * Use prefixed and unprefixed filter for WebKit
     */


    FilterValue.prototype.replace = function replace(value, prefix) {
        if (prefix === '-webkit-' && value.indexOf('filter(') === -1) {
            if (value.indexOf('-webkit-filter') === -1) {
                return _Value.prototype.replace.call(this, value, prefix) + ', ' + value;
            } else {
                return value;
            }
        } else {
            return _Value.prototype.replace.call(this, value, prefix);
        }
    };

    /**
     * Clean -webkit-filter
     */


    FilterValue.prototype.old = function old(prefix) {
        return new OldFilterValue(this.name, prefix + this.name);
    };

    return FilterValue;
}(Value);

Object.defineProperty(FilterValue, 'names', {
    enumerable: true,
    writable: true,
    value: ['filter', 'filter-function']
});


module.exports = FilterValue;