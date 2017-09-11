'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Prefixer = require('./prefixer');
var OldValue = require('./old-value');
var utils = require('./utils');

var vendor = require('postcss/lib/vendor');

var Value = function (_Prefixer) {
    _inherits(Value, _Prefixer);

    function Value() {
        _classCallCheck(this, Value);

        return _possibleConstructorReturn(this, _Prefixer.apply(this, arguments));
    }

    /**
     * Clone decl for each prefixed values
     */
    Value.save = function save(prefixes, decl) {
        var _this2 = this;

        var prop = decl.prop;
        var result = [];

        for (var prefix in decl._autoprefixerValues) {
            var value = decl._autoprefixerValues[prefix];

            if (value === decl.value) {
                continue;
            }

            var item = void 0;
            var propPrefix = vendor.prefix(prop);

            if (propPrefix === prefix) {
                item = decl.value = value;
            } else if (propPrefix === '-pie-') {
                continue;
            } else {
                (function () {
                    var prefixed = prefixes.prefixed(prop, prefix);
                    var rule = decl.parent;
                    if (rule.every(function (i) {
                        return i.prop !== prefixed;
                    })) {
                        var trimmed = value.replace(/\s+/, ' ');
                        var already = rule.some(function (i) {
                            return i.prop === decl.prop && i.value.replace(/\s+/, ' ') === trimmed;
                        });

                        if (!already) {
                            var cloned = _this2.clone(decl, { value: value });
                            item = decl.parent.insertBefore(decl, cloned);
                        }
                    }
                })();
            }

            result.push(item);
        }

        return result;
    };

    /**
     * Is declaration need to be prefixed
     */


    Value.prototype.check = function check(decl) {
        var value = decl.value;
        if (value.indexOf(this.name) !== -1) {
            return !!value.match(this.regexp());
        } else {
            return false;
        }
    };

    /**
     * Lazy regexp loading
     */


    Value.prototype.regexp = function regexp() {
        return this.regexpCache || (this.regexpCache = utils.regexp(this.name));
    };

    /**
     * Add prefix to values in string
     */


    Value.prototype.replace = function replace(string, prefix) {
        return string.replace(this.regexp(), '$1' + prefix + '$2');
    };

    /**
     * Get value with comments if it was not changed
     */


    Value.prototype.value = function value(decl) {
        if (decl.raws.value && decl.raws.value.value === decl.value) {
            return decl.raws.value.raw;
        } else {
            return decl.value;
        }
    };

    /**
     * Save values with next prefixed token
     */


    Value.prototype.add = function add(decl, prefix) {
        if (!decl._autoprefixerValues) {
            decl._autoprefixerValues = {};
        }
        var value = decl._autoprefixerValues[prefix] || this.value(decl);
        value = this.replace(value, prefix);
        if (value) {
            decl._autoprefixerValues[prefix] = value;
        }
    };

    /**
     * Return function to fast find prefixed value
     */


    Value.prototype.old = function old(prefix) {
        return new OldValue(this.name, prefix + this.name);
    };

    return Value;
}(Prefixer);

module.exports = Value;