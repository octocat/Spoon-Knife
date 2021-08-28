/**
 * @fileoverview Utility functions for React pragma configuration
 * @author Yannick Croissant
 */
'use strict';

var JSX_ANNOTATION_REGEX = /^\*\s*@jsx\s+([^\s]+)/;
// Does not check for reserved keywords or unicode characters
var JS_IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;


function getCreateClassFromContext(context) {
  var pragma = 'createReactClass';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.react && context.settings.react.createClass) {
    pragma = context.settings.react.createClass;
  }
  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`createClass pragma ${pragma} is not a valid function name`);
  }
  return pragma;
}

function getFromContext(context) {
  var pragma = 'React';

  var sourceCode = context.getSourceCode();
  var pragmaNode = sourceCode.getAllComments().find(function(node) {
    return JSX_ANNOTATION_REGEX.test(node.value);
  });

  if (pragmaNode) {
    var matches = JSX_ANNOTATION_REGEX.exec(pragmaNode.value);
    pragma = matches[1].split('.')[0];
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (context.settings.react && context.settings.react.pragma) {
    pragma = context.settings.react.pragma;
  }

  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`React pragma ${pragma} is not a valid identifier`);
  }
  return pragma;
}

module.exports = {
  getCreateClassFromContext: getCreateClassFromContext,
  getFromContext: getFromContext
};
