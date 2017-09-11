'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _swPrecache = require('sw-precache');

var _swPrecache2 = _interopRequireDefault(_swPrecache);

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FILEPATH_WARNING = 'sw-prechache-webpack-plugin [filepath]: You are using a custom path for your service worker, this may prevent the service worker from working correctly if it is not available in the same path as your application.';
var FORCEDELETE_WARNING = 'sw-prechache-webpack-plugin [forceDelete]: You are specifying the option forceDelete. This was removed in v0.10. It should not affect your build but should no longer be required.';

var DEFAULT_CACHE_ID = 'sw-precache-webpack-plugin',
    DEFAULT_WORKER_FILENAME = 'service-worker.js',
    DEFAULT_PUBLIC_PATH = '',
    DEFAULT_IMPORT_SCRIPTS = [],
    DEFAULT_IGNORE_PATTERNS = [],
    CHUNK_NAME_NOT_FOUND_ERROR = 'Could not locate files for chunkName: "%s"',

// eslint-disable-next-line max-len
CHUNK_NAME_OVERRIDES_FILENAME_WARNING = 'Don\'t use chunkName & filename together; importScripts[<index>].filename overriden by specified chunkName: %j';

var DEFAULT_OPTIONS = {
  cacheId: DEFAULT_CACHE_ID,
  filename: DEFAULT_WORKER_FILENAME,
  importScripts: DEFAULT_IMPORT_SCRIPTS,
  staticFileGlobsIgnorePatterns: DEFAULT_IGNORE_PATTERNS,
  mergeStaticsConfig: false,
  minify: false
};

var SWPrecacheWebpackPlugin = function () {

  /**
   * SWPrecacheWebpackPlugin - A wrapper for sw-precache to use with webpack
   * @constructor
   * @param {object} options - All parameters should be passed as a single options object. All sw-precache options can be passed here in addition to plugin options.
   *
   * // plugin options:
   * @param {string} [options.filename] - Service worker filename, default is 'service-worker.js'
   * @param {string} [options.filepath] - Service worker path and name, default is to use webpack.output.path + options.filename
   * @param {RegExp} [options.staticFileGlobsIgnorePatterns[]] - Define an optional array of regex patterns to filter out of staticFileGlobs
   * @param {boolean} [options.mergeStaticsConfig=false] - Merge provided staticFileGlobs and stripPrefix(Multi) with webpack's config, rather than having those take precedence
   * @param {boolean} [options.minify=false] - Minify the generated Service worker file using UglifyJS
   * @param {boolean} [options.debug=false] - Output error and warning messages
   */
  function SWPrecacheWebpackPlugin(options) {
    _classCallCheck(this, SWPrecacheWebpackPlugin);

    // generated configuration options
    this.config = {};
    // configuration options passed by user
    this.options = _extends({}, DEFAULT_OPTIONS, options);
    // generated configuration that will override user options
    this.overrides = {};
    // push warning messages here
    this.warnings = [];
  }

  /**
   * @returns {object} - plugin configuration
   */


  _createClass(SWPrecacheWebpackPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      // sw-precache needs physical files to reference so we MUST wait until after assets are emitted before generating the service-worker.
      compiler.plugin('after-emit', function (compilation, callback) {
        _this.configure(compiler, compilation); // configure the serviceworker options
        _this.checkWarnings(compilation);

        // generate service worker then write to file system
        _this.createServiceWorker().then(function (serviceWorker) {
          return _this.writeServiceWorker(serviceWorker, compiler);
        }).then(function () {
          return callback();
        }).catch(function (err) {
          return callback(err);
        });
      });
    }
  }, {
    key: 'configure',
    value: function configure(compiler, compilation) {

      // get the defaults from options
      var _options = this.options,
          importScripts = _options.importScripts,
          staticFileGlobsIgnorePatterns = _options.staticFileGlobsIgnorePatterns,
          mergeStaticsConfig = _options.mergeStaticsConfig,
          _options$stripPrefixM = _options.stripPrefixMulti,
          stripPrefixMulti = _options$stripPrefixM === undefined ? {} : _options$stripPrefixM;

      // get the output path used by webpack

      var outputPath = compiler.outputPath;

      // outputPath + filename or the user option

      var _options$filepath = this.options.filepath,
          filepath = _options$filepath === undefined ? _path2.default.resolve(outputPath, this.options.filename) : _options$filepath;

      // get the public path specified in webpack config

      var _compiler$options$out = compiler.options.output.publicPath,
          publicPath = _compiler$options$out === undefined ? DEFAULT_PUBLIC_PATH : _compiler$options$out;

      // get all assets outputted by webpack

      var assetGlobs = Object.keys(compilation.assets).map(function (f) {
        return _path2.default.join(outputPath, f);
      });

      // merge assetGlobs with provided staticFileGlobs and filter using staticFileGlobsIgnorePatterns
      var staticFileGlobs = assetGlobs.concat(this.options.staticFileGlobs || []).filter(function (text) {
        return !staticFileGlobsIgnorePatterns.some(function (regex) {
          return regex.test(text);
        });
      });

      if (outputPath) {
        // strip the webpack config's output.path (replace for windows users)
        stripPrefixMulti[('' + outputPath + _path2.default.sep).replace(/\\/g, '/')] = publicPath;
      }

      this.config = _extends({}, this.config, {
        staticFileGlobs: staticFileGlobs,
        stripPrefixMulti: stripPrefixMulti
      });

      // set the actual filepath
      this.overrides.filepath = filepath;

      // resolve [hash] used in importScripts
      this.configureImportScripts(importScripts, publicPath, compiler, compilation);

      if (mergeStaticsConfig) {
        // merge generated and user provided options
        this.overrides = _extends({}, this.overrides, {
          staticFileGlobs: staticFileGlobs,
          stripPrefixMulti: stripPrefixMulti
        });
      }
    }
  }, {
    key: 'configureImportScripts',
    value: function configureImportScripts(importScripts, publicPath, compiler, compilation) {
      var _this2 = this;

      if (!importScripts) {
        return;
      }

      var _compilation$getStats = compilation.getStats().toJson({ hash: true, chunks: true }),
          hash = _compilation$getStats.hash,
          chunks = _compilation$getStats.chunks;

      this.overrides.importScripts = importScripts.reduce(function (fileList, criteria) {
        // legacy support for importScripts items defined as string
        if (typeof criteria === 'string') {
          criteria = { filename: criteria };
        }

        var hasFileName = !!criteria.filename;
        var hasChunkName = !!criteria.chunkName;

        if (hasFileName && hasChunkName) {
          _this2.warnings.push(new Error((0, _util.format)(CHUNK_NAME_OVERRIDES_FILENAME_WARNING, criteria)));
        }

        if (hasChunkName) {
          var chunk = chunks.find(function (c) {
            return c.names.includes(criteria.chunkName);
          });

          if (!chunk) {
            compilation.errors.push(new Error((0, _util.format)(CHUNK_NAME_NOT_FOUND_ERROR, criteria.chunkName)));
            return fileList;
          }

          var chunkFileName = chunk.files[chunk.names.indexOf(criteria.chunkName)];
          fileList.push(_url2.default.resolve(publicPath, chunkFileName));
        } else if (hasFileName) {
          var hashedFilename = criteria.filename.replace(/\[hash\]/g, hash);
          fileList.push(_url2.default.resolve(publicPath, hashedFilename));
        }

        return fileList;
      }, []);
    }
  }, {
    key: 'createServiceWorker',
    value: function createServiceWorker() {
      var _this3 = this;

      return _swPrecache2.default.generate(this.workerOptions).then(function (serviceWorkerFileContents) {
        if (_this3.options.minify) {
          var uglifyFiles = {};
          uglifyFiles[_this3.options.filename] = serviceWorkerFileContents;
          return _uglifyJs2.default.minify(uglifyFiles).code;
        }
        return serviceWorkerFileContents;
      });
    }
  }, {
    key: 'writeServiceWorker',
    value: function writeServiceWorker(serviceWorker, compiler) {
      var filepath = this.workerOptions.filepath;
      var _compiler$outputFileS = compiler.outputFileSystem,
          mkdirp = _compiler$outputFileS.mkdirp,
          writeFile = _compiler$outputFileS.writeFile;

      // use the outputFileSystem api to manually write service workers rather than adding to the compilation assets

      return new Promise(function (resolve) {
        mkdirp(_path2.default.resolve(filepath, '..'), function () {
          writeFile(filepath, serviceWorker, resolve);
        });
      });
    }

    /**
     * Push plugin warnings to webpack log
     * @param {object} compilation - webpack compilation
     * @returns {void}
     */

  }, {
    key: 'checkWarnings',
    value: function checkWarnings(compilation) {
      if (this.options.filepath) {
        // warn about changing filepath
        this.warnings.push(new Error(FILEPATH_WARNING));
      }

      if (this.options.forceDelete) {
        // deprecate forceDelete
        this.warnings.push(new Error(FORCEDELETE_WARNING));
      }

      if (this.workerOptions.debug) {
        this.warnings.forEach(function (warning) {
          return compilation.warnings.push(warning);
        });
      }
    }
  }, {
    key: 'workerOptions',
    get: function get() {
      return _extends({}, this.config, this.options, this.overrides);
    }
  }]);

  return SWPrecacheWebpackPlugin;
}();

module.exports = SWPrecacheWebpackPlugin;