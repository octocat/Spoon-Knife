'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Value = require('../value');

var ImageSet = function (_Value) {
    _inherits(ImageSet, _Value);

    function ImageSet() {
        _classCallCheck(this, ImageSet);

        return _possibleConstructorReturn(this, _Value.apply(this, arguments));
    }

    /**
     * Use non-standard name for WebKit and Firefox
     */
    ImageSet.prototype.replace = function replace(string, prefix) {
        if (prefix === '-webkit-') {
            return _Value.prototype.replace.call(this, string, prefix).replace(/("[^"]+"|'[^']+')(\s+\d+\w)/gi, 'url($1)$2');
        } else {
            return _Value.prototype.replace.call(this, string, prefix);
        }
    };

    return ImageSet;
}(Value);

Object.defineProperty(ImageSet, 'names', {
    enumerable: true,
    writable: true,
    value: ['image-set']
});


module.exports = ImageSet;