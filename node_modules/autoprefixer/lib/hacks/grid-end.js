'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Declaration = require('../declaration');

var GridEnd = function (_Declaration) {
    _inherits(GridEnd, _Declaration);

    function GridEnd() {
        _classCallCheck(this, GridEnd);

        return _possibleConstructorReturn(this, _Declaration.apply(this, arguments));
    }

    /**
     * Do not add prefix for unsupported value in IE
     */
    GridEnd.prototype.check = function check(decl) {
        return decl.value.indexOf('span') !== -1;
    };

    /**
     * Return a final spec property
     */


    GridEnd.prototype.normalize = function normalize(prop) {
        return prop.replace(/(-span|-end)/, '');
    };

    /**
     * Change property name for IE
     */


    GridEnd.prototype.prefixed = function prefixed(prop, prefix) {
        if (prefix === '-ms-') {
            return prefix + prop.replace('-end', '-span');
        } else {
            return _Declaration.prototype.prefixed.call(this, prop, prefix);
        }
    };

    /**
     * Change repeating syntax for IE
     */


    GridEnd.prototype.set = function set(decl, prefix) {
        if (prefix === '-ms-') {
            decl.value = decl.value.replace(/span\s/i, '');
        }
        return _Declaration.prototype.set.call(this, decl, prefix);
    };

    return GridEnd;
}(Declaration);

Object.defineProperty(GridEnd, 'names', {
    enumerable: true,
    writable: true,
    value: ['grid-row-end', 'grid-column-end', 'grid-row-span', 'grid-column-span']
});


module.exports = GridEnd;