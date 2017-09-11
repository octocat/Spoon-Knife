/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require('path');

var loaderUtils = require('loader-utils');
var validateOptions = require('schema-utils');

module.exports = function () {};

module.exports.pitch = function (request) {
	if (this.cacheable) this.cacheable();

	var options = loaderUtils.getOptions(this) || {};

	validateOptions(require('./options.json'), options, 'Style Loader (URL)');

	return [
		"// style-loader: Adds some reference to a css file to the DOM by adding a <link> tag",
		"var update = require(" + loaderUtils.stringifyRequest(this, "!" + path.join(__dirname, "lib", "addStyleUrl.js")) + ")(",
		"\trequire(" + loaderUtils.stringifyRequest(this, "!!" + request) + ")",
		", " + JSON.stringify(options) + ");",
		"// Hot Module Replacement",
		"if(module.hot) {",
		"\tmodule.hot.accept(" + loaderUtils.stringifyRequest(this, "!!" + request) + ", function() {",
		"\t\tupdate(require(" + loaderUtils.stringifyRequest(this, "!!" + request) + "));",
		"\t});",
		"\tmodule.hot.dispose(function() { update(); });",
		"}"
	].join("\n");
};
