var path = require('path');
var fse = require('fs-extra');
var _ = require('lodash');

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    publicPath: '',
    fileName: 'manifest.json',
    stripSrc: null,
    transformExtensions: /^(gz|map)$/i,
    writeToFileEmit: false,
    cache: null, // TODO: Remove `cache` in next major release in favour of `seed`.
    seed: null
  }, opts || {});
}

ManifestPlugin.prototype.getFileType = function(str) {
  str = str.replace(/\?.*/, '');
  var split = str.split('.');
  var ext = split.pop();
  if (this.opts.transformExtensions.test(ext)) {
    ext = split.pop() + '.' + ext;
  }
  return ext;
};

ManifestPlugin.prototype.apply = function(compiler) {
  var outputName = this.opts.fileName;
  var seed = this.opts.seed || this.opts.cache || {};
  var moduleAssets = {};

  compiler.plugin("compilation", function (compilation) {
    compilation.plugin('module-asset', function (module, file) {
      moduleAssets[file] = path.join(
          path.dirname(file),
          path.basename(module.userRequest)
      );
    });
  });

  compiler.plugin('emit', function(compilation, compileCallback) {
    var stats = compilation.getStats().toJson();
    var manifest = {};

    _.merge(manifest, compilation.chunks.reduce(function(memo, chunk) {
      var chunkName = chunk.name ? chunk.name.replace(this.opts.stripSrc, '') : null;

      // Map original chunk name to output files.
      // For nameless chunks, just map the files directly.
      return chunk.files.reduce(function(memo, file) {
        // Don't add hot updates to manifest
        if (file.indexOf('hot-update') >= 0) {
          return memo;
        }
        if (chunkName) {
          memo[chunkName + '.' + this.getFileType(file)] = file;
        } else {
          memo[file] = file;
        }
        return memo;
      }.bind(this), memo);
    }.bind(this), {}));

    // module assets don't show up in assetsByChunkName.
    // we're getting them this way;
    _.merge(manifest, stats.assets.reduce(function(memo, asset) {
      var name = moduleAssets[asset.name];
      if (name) {
        memo[name] = asset.name;
      }
      return memo;
    }, {}));

    // Append optional basepath onto all references.
    // This allows output path to be reflected in the manifest.
    if (this.opts.basePath) {
      manifest = _.reduce(manifest, function(memo, value, key) {
        memo[this.opts.basePath + key] = this.opts.basePath + value;
        return memo;
      }.bind(this), {});
    } else if (this.opts.publicPath) {
      // Similar to basePath but only affects the value (similar to how
      // output.publicPath turns require('foo/bar') into '/public/foo/bar', see
      // https://github.com/webpack/docs/wiki/configuration#outputpublicpath
      manifest = _.reduce(manifest, function(memo, value, key) {
        memo[key] = this.opts.publicPath + value;
        return memo;
      }.bind(this), {});
    }

    Object.keys(manifest).sort().forEach(function(key) {
      seed[key] = manifest[key];
    });

    var json = JSON.stringify(seed, null, 2);

    compilation.assets[outputName] = {
      source: function() {
        return json;
      },
      size: function() {
        return json.length;
      }
    };

    if (this.opts.writeToFileEmit) {
      var outputFolder = compilation.options.output.path;
      var outputFile = path.join(outputFolder, this.opts.fileName);

      fse.outputFileSync(outputFile, json);
    }

    compileCallback();
  }.bind(this));
};

module.exports = ManifestPlugin;
