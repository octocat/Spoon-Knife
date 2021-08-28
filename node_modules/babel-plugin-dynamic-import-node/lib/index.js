Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelPluginSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');

var _babelPluginSyntaxDynamicImport2 = _interopRequireDefault(_babelPluginSyntaxDynamicImport);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TYPE_IMPORT = 'Import';

var buildImport = (0, _babelTemplate2['default'])('\n  Promise.resolve().then(() => require(SOURCE))\n');

exports['default'] = function () {
  return {
    inherits: _babelPluginSyntaxDynamicImport2['default'],

    visitor: {
      CallExpression: function () {
        function CallExpression(path) {
          if (path.node.callee.type === TYPE_IMPORT) {
            var importArgument = path.node.arguments[0];
            var newImport = buildImport({
              SOURCE: t.isStringLiteral(importArgument) || t.isTemplateLiteral(importArgument) ? path.node.arguments : t.templateLiteral([t.templateElement({ raw: '', cooked: '' }), t.templateElement({ raw: '', cooked: '' }, true)], path.node.arguments)
            });
            path.replaceWith(newImport);
          }
        }

        return CallExpression;
      }()
    }
  };
};