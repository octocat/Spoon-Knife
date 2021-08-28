'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var flexSpec = require('./flex-spec');
var Declaration = require('../declaration');

var FlexDirection = function (_Declaration) {
    _inherits(FlexDirection, _Declaration);

    function FlexDirection() {
        _classCallCheck(this, FlexDirection);

        return _possibleConstructorReturn(this, _Declaration.apply(this, arguments));
    }

    /**
     * Return property name by final spec
     */
    FlexDirection.prototype.normalize = function normalize() {
        return 'flex-direction';
    };

    /**
     * Use two properties for 2009 spec
     */


    FlexDirection.prototype.insert = function insert(decl, prefix, prefixes) {
        var spec = void 0;

        var _flexSpec = flexSpec(prefix);

        spec = _flexSpec[0];
        prefix = _flexSpec[1];

        if (spec !== 2009) {
            return _Declaration.prototype.insert.call(this, decl, prefix, prefixes);
        } else {
            var already = decl.parent.some(function (i) {
                return i.prop === prefix + 'box-orient' || i.prop === prefix + 'box-direction';
            });
            if (already) {
                return undefined;
            }

            var value = decl.value;
            var orient = value.indexOf('row') !== -1 ? 'horizontal' : 'vertical';
            var dir = value.indexOf('reverse') !== -1 ? 'reverse' : 'normal';

            var cloned = this.clone(decl);
            cloned.prop = prefix + 'box-orient';
            cloned.value = orient;
            if (this.needCascade(decl)) {
                cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
            }
            decl.parent.insertBefore(decl, cloned);

            cloned = this.clone(decl);
            cloned.prop = prefix + 'box-direction';
            cloned.value = dir;
            if (this.needCascade(decl)) {
                cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
            }
            return decl.parent.insertBefore(decl, cloned);
        }
    };

    /**
     * Clean two properties for 2009 spec
     */


    FlexDirection.prototype.old = function old(prop, prefix) {
        var spec = void 0;

        var _flexSpec2 = flexSpec(prefix);

        spec = _flexSpec2[0];
        prefix = _flexSpec2[1];

        if (spec === 2009) {
            return [prefix + 'box-orient', prefix + 'box-direction'];
        } else {
            return _Declaration.prototype.old.call(this, prop, prefix);
        }
    };

    return FlexDirection;
}(Declaration);

Object.defineProperty(FlexDirection, 'names', {
    enumerable: true,
    writable: true,
    value: ['flex-direction', 'box-direction', 'box-orient']
});


module.exports = FlexDirection;