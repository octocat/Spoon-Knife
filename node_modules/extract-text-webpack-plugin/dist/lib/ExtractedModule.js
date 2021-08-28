'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webpackSources = require('webpack-sources');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExtractedModule = function () {
  function ExtractedModule(identifier, originalModule, source, sourceMap, addtitionalInformation, prevModules) {
    _classCallCheck(this, ExtractedModule);

    this._identifier = identifier;
    this._originalModule = originalModule;
    this._source = source;
    this._sourceMap = sourceMap;
    this._prevModules = prevModules;
    this.addtitionalInformation = addtitionalInformation;
    this.chunks = [];
  }

  _createClass(ExtractedModule, [{
    key: 'getOrder',
    value: function getOrder() {
      // http://stackoverflow.com/a/14676665/1458162
      return (/^@import url/.test(this._source) ? 0 : 1
      );
    }
  }, {
    key: 'addChunk',
    value: function addChunk(chunk) {
      var idx = this.chunks.indexOf(chunk);
      if (idx < 0) {
        this.chunks.push(chunk);
      }
    }
  }, {
    key: 'removeChunk',
    value: function removeChunk(chunk) {
      var idx = this.chunks.indexOf(chunk);
      if (idx >= 0) {
        this.chunks.splice(idx, 1);
        chunk.removeModule(this);
        return true;
      }
      return false;
    }
  }, {
    key: 'rewriteChunkInReasons',
    value: function rewriteChunkInReasons(oldChunk, newChunks) {} // eslint-disable-line

  }, {
    key: 'identifier',
    value: function identifier() {
      return this._identifier;
    }
  }, {
    key: 'source',
    value: function source() {
      if (this._sourceMap) {
        return new _webpackSources.SourceMapSource(this._source, null, this._sourceMap);
      }
      return new _webpackSources.RawSource(this._source);
    }
  }, {
    key: 'getOriginalModule',
    value: function getOriginalModule() {
      return this._originalModule;
    }
  }, {
    key: 'getPrevModules',
    value: function getPrevModules() {
      return this._prevModules;
    }
  }, {
    key: 'addPrevModules',
    value: function addPrevModules(prevModules) {
      var _this = this;

      prevModules.forEach(function (m) {
        if (_this._prevModules.indexOf(m) < 0) {
          _this._prevModules.push(m);
        }
      }, this);
    }
  }, {
    key: 'setOriginalModule',
    value: function setOriginalModule(originalModule) {
      this._originalModule = originalModule;
    }
  }]);

  return ExtractedModule;
}();

exports.default = ExtractedModule;