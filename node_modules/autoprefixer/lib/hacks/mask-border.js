'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Declaration = require('../declaration');

var MaskBorder = function (_Declaration) {
    _inherits(MaskBorder, _Declaration);

    function MaskBorder() {
        _classCallCheck(this, MaskBorder);

        return _possibleConstructorReturn(this, _Declaration.apply(this, arguments));
    }

    /**
     * Return property name by final spec
     */
    MaskBorder.prototype.normalize = function normalize() {
        return this.name.replace('box-image', 'border');
    };

    /**
     * Return flex property for 2012 spec
     */


    MaskBorder.prototype.prefixed = function prefixed(prop, prefix) {
        if (prefix === '-webkit-') {
            return _Declaration.prototype.prefixed.call(this, prop, prefix).replace('border', 'box-image');
        } else {
            return _Declaration.prototype.prefixed.call(this, prop, prefix);
        }
    };

    return MaskBorder;
}(Declaration);

Object.defineProperty(MaskBorder, 'names', {
    enumerable: true,
    writable: true,
    value: ['mask-border', 'mask-border-source', 'mask-border-slice', 'mask-border-width', 'mask-border-outset', 'mask-border-repeat', 'mask-box-image', 'mask-box-image-source', 'mask-box-image-slice', 'mask-box-image-width', 'mask-box-image-outset', 'mask-box-image-repeat']
});


module.exports = MaskBorder;