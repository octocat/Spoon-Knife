'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pitch = pitch;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');

var _NodeTemplatePlugin2 = _interopRequireDefault(_NodeTemplatePlugin);

var _NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');

var _NodeTargetPlugin2 = _interopRequireDefault(_NodeTargetPlugin);

var _LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');

var _LibraryTemplatePlugin2 = _interopRequireDefault(_LibraryTemplatePlugin);

var _SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var _SingleEntryPlugin2 = _interopRequireDefault(_SingleEntryPlugin);

var _LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');

var _LimitChunkCountPlugin2 = _interopRequireDefault(_LimitChunkCountPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NS = _fs2.default.realpathSync(__dirname);

exports.default = function (source) {
  return source;
};

function pitch(request) {
  var _this = this;

  var query = _loaderUtils2.default.getOptions(this) || {};
  var loaders = this.loaders.slice(this.loaderIndex + 1);
  this.addDependency(this.resourcePath);
  // We already in child compiler, return empty bundle
  if (this[NS] === undefined) {
    // eslint-disable-line no-undefined
    throw new Error('"extract-text-webpack-plugin" loader is used without the corresponding plugin, ' + 'refer to https://github.com/webpack/extract-text-webpack-plugin for the usage example');
  } else if (this[NS] === false) {
    return '';
  } else if (this[NS](null, query)) {
    if (query.omit) {
      this.loaderIndex += +query.omit + 1;
      request = request.split('!').slice(+query.omit).join('!');
      loaders = loaders.slice(+query.omit);
    }
    var resultSource = void 0;
    if (query.remove) {
      resultSource = '// removed by extract-text-webpack-plugin';
    } else {
      resultSource = undefined; // eslint-disable-line no-undefined
    }

    var childFilename = 'extract-text-webpack-plugin-output-filename'; // eslint-disable-line no-path-concat
    var publicPath = typeof query.publicPath === 'string' ? query.publicPath : this._compilation.outputOptions.publicPath;
    var outputOptions = {
      filename: childFilename,
      publicPath
    };
    var childCompiler = this._compilation.createChildCompiler(`extract-text-webpack-plugin ${NS} ${request}`, outputOptions);
    childCompiler.apply(new _NodeTemplatePlugin2.default(outputOptions));
    childCompiler.apply(new _LibraryTemplatePlugin2.default(null, 'commonjs2'));
    childCompiler.apply(new _NodeTargetPlugin2.default());
    childCompiler.apply(new _SingleEntryPlugin2.default(this.context, `!!${request}`));
    childCompiler.apply(new _LimitChunkCountPlugin2.default({ maxChunks: 1 }));
    // We set loaderContext[NS] = false to indicate we already in
    // a child compiler so we don't spawn another child compilers from there.
    childCompiler.plugin('this-compilation', function (compilation) {
      compilation.plugin('normal-module-loader', function (loaderContext, module) {
        loaderContext[NS] = false;
        if (module.request === request) {
          module.loaders = loaders.map(function (loader) {
            return {
              loader: loader.path,
              options: loader.options
            };
          });
        }
      });
    });

    var source = void 0;
    childCompiler.plugin('after-compile', function (compilation, callback) {
      source = compilation.assets[childFilename] && compilation.assets[childFilename].source();

      // Remove all chunk assets
      compilation.chunks.forEach(function (chunk) {
        chunk.files.forEach(function (file) {
          delete compilation.assets[file];
        });
      });

      callback();
    });
    var callback = this.async();
    childCompiler.runAsChild(function (err, entries, compilation) {
      if (err) return callback(err);

      if (compilation.errors.length > 0) {
        return callback(compilation.errors[0]);
      }
      compilation.fileDependencies.forEach(function (dep) {
        _this.addDependency(dep);
      }, _this);
      compilation.contextDependencies.forEach(function (dep) {
        _this.addContextDependency(dep);
      }, _this);
      if (!source) {
        return callback(new Error("Didn't get a result from child compiler"));
      }
      try {
        var text = _this.exec(source, request);
        if (typeof text === 'string') {
          text = [[0, text]];
        }
        text.forEach(function (item) {
          var id = item[0];
          compilation.modules.forEach(function (module) {
            if (module.id === id) {
              item[0] = module.identifier();
            }
          });
        });
        _this[NS](text, query);
        if (text.locals && typeof resultSource !== 'undefined') {
          resultSource += `\nmodule.exports = ${JSON.stringify(text.locals)};`;
        }
      } catch (e) {
        return callback(e);
      }
      if (resultSource) {
        callback(null, resultSource);
      } else {
        callback();
      }
    });
  }
}