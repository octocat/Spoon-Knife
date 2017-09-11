'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Declaration = require('../declaration');

var GridStart = function (_Declaration) {
    _inherits(GridStart, _Declaration);

    function GridStart() {
        _classCallCheck(this, GridStart);

        return _possibleConstructorReturn(this, _Declaration.apply(this, arguments));
    }

    /**
     * Do not add prefix for unsupported value in IE
     */
    GridStart.prototype.check = function check(decl) {
        return decl.value.indexOf('/') === -1 || decl.value.indexOf('span') !== -1;
    };

    /**
     * Return a final spec property
     */


    GridStart.prototype.normalize = function normalize(prop) {
        return prop.replace('-start', '');
    };

    /**
     * Change property name for IE
     */


    GridStart.prototype.prefixed = function prefixed(prop, prefix) {
        if (prefix === '-ms-') {
            return prefix + prop.replace('-start', '');
        } else {
            return _Declaration.prototype.prefixed.call(this, prop, prefix);
        }
    };

    /**
     * Split one value to two
     */


    GridStart.prototype.insert = function insert(decl, prefix, prefixes) {
        var parts = this.splitValue(decl, prefix);
        if (parts.length === 2) {
            decl.cloneBefore({
                prop: '-ms-' + decl.prop + '-span',
                value: parts[1]
            });
        }
        return _Declaration.prototype.insert.call(this, decl, prefix, prefixes);
    };

    /**
     * Change value for combine property
     */


    GridStart.prototype.set = function set(decl, prefix) {
        var parts = this.splitValue(decl, prefix);
        if (parts.length === 2) {
            decl.value = parts[0];
        }
        return _Declaration.prototype.set.call(this, decl, prefix);
    };

    /**
     * If property contains start and end
     */


    GridStart.prototype.splitValue = function splitValue(decl, prefix) {
        if (prefix === '-ms-' && decl.prop.indexOf('-start') === -1) {
            var parts = decl.value.split(/\s*\/\s*span\s+/);
            if (parts.length === 2) {
                return parts;
            }
        }
        return false;
    };

    return GridStart;
}(Declaration);

Object.defineProperty(GridStart, 'names', {
    enumerable: true,
    writable: true,
    value: ['grid-row-start', 'grid-column-start', 'grid-row', 'grid-column']
});


module.exports = GridStart;