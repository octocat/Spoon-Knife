'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OldValue = require('../old-value');
var Value = require('../value');

var FlexValues = function (_Value) {
    _inherits(FlexValues, _Value);

    function FlexValues() {
        _classCallCheck(this, FlexValues);

        return _possibleConstructorReturn(this, _Value.apply(this, arguments));
    }

    /**
     * Return prefixed property name
     */
    FlexValues.prototype.prefixed = function prefixed(prefix) {
        return this.all.prefixed(this.name, prefix);
    };

    /**
     * Change property name to prefixed property name
     */


    FlexValues.prototype.replace = function replace(string, prefix) {
        return string.replace(this.regexp(), '$1' + this.prefixed(prefix) + '$3');
    };

    /**
     * Return function to fast prefixed property name
     */


    FlexValues.prototype.old = function old(prefix) {
        return new OldValue(this.name, this.prefixed(prefix));
    };

    return FlexValues;
}(Value);

Object.defineProperty(FlexValues, 'names', {
    enumerable: true,
    writable: true,
    value: ['flex', 'flex-grow', 'flex-shrink', 'flex-basis']
});


module.exports = FlexValues;