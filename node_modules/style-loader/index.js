/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var path = require("path");

var loaderUtils = require("loader-utils");
var validateOptions = require('schema-utils');

module.exports = function () {};

module.exports.pitch = function (request) {
	if (this.cacheable) this.cacheable();

	var options = loaderUtils.getOptions(this) || {};

	validateOptions(require('./options.json'), options, 'Style Loader')

	return [
		"// style-loader: Adds some css to the DOM by adding a <style> tag",
		"",
		"// load the styles",
		"var content = require(" + loaderUtils.stringifyRequest(this, "!!" + request) + ");",
		"if(typeof content === 'string') content = [[module.id, content, '']];",
		"// Prepare cssTransformation",
		"var transform;",
		options.transform ? "transform = require(" + loaderUtils.stringifyRequest(this, "!" + path.resolve(options.transform)) + ");" : "",
		"var options = " + JSON.stringify(options),
		"options.transform = transform",
		"// add the styles to the DOM",
		"var update = require(" + loaderUtils.stringifyRequest(this, "!" + path.join(__dirname, "lib", "addStyles.js")) + ")(content, options);",
		"if(content.locals) module.exports = content.locals;",
		"// Hot Module Replacement",
		"if(module.hot) {",
		"	// When the styles change, update the <style> tags",
		"	if(!content.locals) {",
		"		module.hot.accept(" + loaderUtils.stringifyRequest(this, "!!" + request) + ", function() {",
		"			var newContent = require(" + loaderUtils.stringifyRequest(this, "!!" + request) + ");",
		"			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];",
		"			update(newContent);",
		"		});",
		"	}",
		"	// When the module is disposed, remove the <style> tags",
		"	module.hot.dispose(function() { update(); });",
		"}"
	].join("\n");
};
