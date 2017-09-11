'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-multi-assign */


var _ExtractedModule = require('./ExtractedModule');

var _ExtractedModule2 = _interopRequireDefault(_ExtractedModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExtractTextPluginCompilation = function () {
  function ExtractTextPluginCompilation() {
    _classCallCheck(this, ExtractTextPluginCompilation);

    this.modulesByIdentifier = {};
  }

  _createClass(ExtractTextPluginCompilation, [{
    key: 'addModule',
    value: function addModule(identifier, originalModule, source, additionalInformation, sourceMap, prevModules) {
      var m = void 0;
      if (!this.modulesByIdentifier[identifier]) {
        m = this.modulesByIdentifier[identifier] = new _ExtractedModule2.default(identifier, originalModule, source, sourceMap, additionalInformation, prevModules);
      } else {
        m = this.modulesByIdentifier[identifier];
        m.addPrevModules(prevModules);
        if (originalModule.index2 < m.getOriginalModule().index2) {
          m.setOriginalModule(originalModule);
        }
      }
      return m;
    }
  }, {
    key: 'addResultToChunk',
    value: function addResultToChunk(identifier, result, originalModule, extractedChunk) {
      var _this = this;

      if (!Array.isArray(result)) {
        result = [[identifier, result]];
      }
      var counterMap = {};
      var prevModules = [];
      result.forEach(function (item) {
        var c = counterMap[item[0]];
        var module = _this.addModule.call(_this, item[0] + (c || ''), originalModule, item[1], item[2], item[3], prevModules.slice());
        extractedChunk.addModule(module);
        module.addChunk(extractedChunk);
        counterMap[item[0]] = (c || 0) + 1;
        prevModules.push(module);
      }, this);
    }
  }]);

  return ExtractTextPluginCompilation;
}();

exports.default = ExtractTextPluginCompilation;