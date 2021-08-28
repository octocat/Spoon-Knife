'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parser = require('postcss-value-parser');

var Declaration = require('../declaration');

var GridTemplate = function (_Declaration) {
    _inherits(GridTemplate, _Declaration);

    function GridTemplate() {
        _classCallCheck(this, GridTemplate);

        return _possibleConstructorReturn(this, _Declaration.apply(this, arguments));
    }

    /**
     * Change property name for IE
     */
    GridTemplate.prototype.prefixed = function prefixed(prop, prefix) {
        if (prefix === '-ms-') {
            return prefix + prop.replace('template-', '');
        } else {
            return _Declaration.prototype.prefixed.call(this, prop, prefix);
        }
    };

    /**
     * Change IE property back
     */


    GridTemplate.prototype.normalize = function normalize(prop) {
        return prop.replace(/^grid-(rows|columns)/, 'grid-template-$1');
    };

    /**
     * Recursive part of changeRepeat
     */


    GridTemplate.prototype.walkRepeat = function walkRepeat(node) {
        var fixed = [];
        for (var _iterator = node.nodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var i = _ref;

            if (i.nodes) {
                this.walkRepeat(i);
            }
            fixed.push(i);
            if (i.type === 'function' && i.value === 'repeat') {
                var first = i.nodes.shift();
                if (first) {
                    var count = first.value;
                    i.nodes.shift();
                    i.value = '';
                    fixed.push({ type: 'word', value: '[' + count + ']' });
                }
            }
        }
        node.nodes = fixed;
    };

    /**
     * IE repeating syntax
     */


    GridTemplate.prototype.changeRepeat = function changeRepeat(value) {
        var ast = parser(value);
        this.walkRepeat(ast);
        return ast.toString();
    };

    /**
     * Change repeating syntax for IE
     */


    GridTemplate.prototype.set = function set(decl, prefix) {
        if (prefix === '-ms-' && decl.value.indexOf('repeat(') !== -1) {
            decl.value = this.changeRepeat(decl.value);
        }
        return _Declaration.prototype.set.call(this, decl, prefix);
    };

    return GridTemplate;
}(Declaration);

Object.defineProperty(GridTemplate, 'names', {
    enumerable: true,
    writable: true,
    value: ['grid-template-rows', 'grid-template-columns', 'grid-rows', 'grid-columns']
});


module.exports = GridTemplate;