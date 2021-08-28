/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Jamund Ferguson
 * @author Brandyn Bennett
 * @author Michael Ficarra
 * @author Vignesh Anand
 * @author Jamund Ferguson
 * @author Yannick Croissant
 * @author Erik Wendel
 */
'use strict';

var has = require('has');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var SPACING = {
  always: 'always',
  never: 'never'
};
var SPACING_VALUES = [SPACING.always, SPACING.never];

module.exports = {
  meta: {
    docs: {
      description: 'Enforce or disallow spaces inside of curly braces in JSX attributes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',

    schema: [{
      definitions: {
        basicConfig: {
          type: 'object',
          properties: {
            when: {
              enum: SPACING_VALUES
            },
            allowMultiline: {
              type: 'boolean'
            },
            spacing: {
              type: 'object',
              properties: {
                objectLiterals: {
                  enum: SPACING_VALUES
                }
              }
            }
          }
        },
        basicConfigOrBoolean: {
          oneOf: [{
            $ref: '#/definitions/basicConfig'
          }, {
            type: 'boolean'
          }]
        }
      },

      oneOf: [{
        allOf: [{
          $ref: '#/definitions/basicConfig'
        }, {
          type: 'object',
          properties: {
            attributes: {
              $ref: '#/definitions/basicConfigOrBoolean'
            },
            children: {
              $ref: '#/definitions/basicConfigOrBoolean'
            }
          }
        }]
      }, {
        enum: SPACING_VALUES
      }]
    }, {
      type: 'object',
      properties: {
        allowMultiline: {
          type: 'boolean'
        },
        spacing: {
          type: 'object',
          properties: {
            objectLiterals: {
              enum: SPACING_VALUES
            }
          }
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {

    function normalizeConfig(configOrTrue, defaults, lastPass) {
      var config = configOrTrue === true ? {} : configOrTrue;
      var when = config.when || defaults.when;
      var allowMultiline = has(config, 'allowMultiline') ? config.allowMultiline : defaults.allowMultiline;
      var spacing = config.spacing || {};
      var objectLiteralSpaces = spacing.objectLiterals || defaults.objectLiteralSpaces;
      if (lastPass) {
        // On the final pass assign the values that should be derived from others if they are still undefined
        objectLiteralSpaces = objectLiteralSpaces || when;
      }

      return {
        when,
        allowMultiline,
        objectLiteralSpaces
      };
    }

    var DEFAULT_WHEN = SPACING.never;
    var DEFAULT_ALLOW_MULTILINE = true;
    var DEFAULT_ATTRIBUTES = true;
    var DEFAULT_CHILDREN = false;

    var sourceCode = context.getSourceCode();
    var originalConfig = context.options[0] || {};
    if (SPACING_VALUES.indexOf(originalConfig) !== -1) {
      originalConfig = Object.assign({when: context.options[0]}, context.options[1]);
    }
    var defaultConfig = normalizeConfig(originalConfig, {
      when: DEFAULT_WHEN,
      allowMultiline: DEFAULT_ALLOW_MULTILINE
    });
    var attributes = has(originalConfig, 'attributes') ? originalConfig.attributes : DEFAULT_ATTRIBUTES;
    var attributesConfig = attributes ? normalizeConfig(attributes, defaultConfig, true) : null;
    var children = has(originalConfig, 'children') ? originalConfig.children : DEFAULT_CHILDREN;
    var childrenConfig = children ? normalizeConfig(children, defaultConfig, true) : null;

    // --------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens have a newline between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is a newline between the tokens.
     */
    function isMultiline(left, right) {
      return left.loc.start.line !== right.loc.start.line;
    }

    /**
    * Reports that there shouldn't be a newline after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportNoBeginningNewline(node, token, spacing) {
      context.report({
        node: node,
        loc: token.loc.start,
        message: `There should be no newline after '${token.value}'`,
        fix: function(fixer) {
          var nextToken = sourceCode.getTokenAfter(token);
          return fixer.replaceTextRange([token.range[1], nextToken.range[0]], spacing === SPACING.always ? ' ' : '');
        }
      });
    }

    /**
    * Reports that there shouldn't be a newline before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportNoEndingNewline(node, token, spacing) {
      context.report({
        node: node,
        loc: token.loc.start,
        message: `There should be no newline before '${token.value}'`,
        fix: function(fixer) {
          var previousToken = sourceCode.getTokenBefore(token);
          return fixer.replaceTextRange([previousToken.range[1], token.range[0]], spacing === SPACING.always ? ' ' : '');
        }
      });
    }

    /**
    * Reports that there shouldn't be a space after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportNoBeginningSpace(node, token) {
      context.report({
        node: node,
        loc: token.loc.start,
        message: `There should be no space after '${token.value}'`,
        fix: function(fixer) {
          var nextToken = sourceCode.getTokenAfter(token);
          var nextNode = sourceCode.getNodeByRangeIndex(nextToken.range[0]);
          var leadingComments = sourceCode.getComments(nextNode).leading;
          var rangeEndRef = leadingComments.length ? leadingComments[0] : nextToken;
          return fixer.removeRange([token.range[1], rangeEndRef.range[0]]);
        }
      });
    }

    /**
    * Reports that there shouldn't be a space before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportNoEndingSpace(node, token) {
      context.report({
        node: node,
        loc: token.loc.start,
        message: `There should be no space before '${token.value}'`,
        fix: function(fixer) {
          var previousToken = sourceCode.getTokenBefore(token);
          var previousNode = sourceCode.getNodeByRangeIndex(previousToken.range[0]);
          var trailingComments = sourceCode.getComments(previousNode).trailing;
          var rangeStartRef = trailingComments.length ? trailingComments[trailingComments.length - 1] : previousToken;
          return fixer.removeRange([rangeStartRef.range[1], token.range[0]]);
        }
      });
    }

    /**
    * Reports that there should be a space after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportRequiredBeginningSpace(node, token) {
      context.report({
        node: node,
        loc: token.loc.start,
        message: `A space is required after '${token.value}'`,
        fix: function(fixer) {
          return fixer.insertTextAfter(token, ' ');
        }
      });
    }

    /**
    * Reports that there should be a space before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Token} token - The token to use for the report.
    * @returns {void}
    */
    function reportRequiredEndingSpace(node, token) {
      context.report({
        node: node,
        loc: token.loc.start,
        message: `A space is required before '${token.value}'`,
        fix: function(fixer) {
          return fixer.insertTextBefore(token, ' ');
        }
      });
    }

    /**
     * Determines if spacing in curly braces is valid.
     * @param {ASTNode} node The AST node to check.
     * @returns {void}
     */
    function validateBraceSpacing(node) {
      var config;
      switch (node.parent.type) {
        case 'JSXAttribute':
        case 'JSXOpeningElement':
          config = attributesConfig;
          break;

        case 'JSXElement':
          config = childrenConfig;
          break;

        default:
          return;
      }
      if (config === null) {
        return;
      }

      var first = context.getFirstToken(node);
      var last = sourceCode.getLastToken(node);
      var second = context.getTokenAfter(first, {includeComments: true});
      var penultimate = sourceCode.getTokenBefore(last, {includeComments: true});

      if (!second) {
        second = context.getTokenAfter(first);
        var leadingComments = sourceCode.getNodeByRangeIndex(second.range[0]).leadingComments;
        second = leadingComments ? leadingComments[0] : second;
      }
      if (!penultimate) {
        penultimate = sourceCode.getTokenBefore(last);
        var trailingComments = sourceCode.getNodeByRangeIndex(penultimate.range[0]).trailingComments;
        penultimate = trailingComments ? trailingComments[trailingComments.length - 1] : penultimate;
      }

      var isObjectLiteral = first.value === second.value;
      var spacing = isObjectLiteral ? config.objectLiteralSpaces : config.when;
      if (spacing === SPACING.always) {
        if (!sourceCode.isSpaceBetweenTokens(first, second)) {
          reportRequiredBeginningSpace(node, first);
        } else if (!config.allowMultiline && isMultiline(first, second)) {
          reportNoBeginningNewline(node, first, spacing);
        }
        if (!sourceCode.isSpaceBetweenTokens(penultimate, last)) {
          reportRequiredEndingSpace(node, last);
        } else if (!config.allowMultiline && isMultiline(penultimate, last)) {
          reportNoEndingNewline(node, last, spacing);
        }
      } else if (spacing === SPACING.never) {
        if (isMultiline(first, second)) {
          if (!config.allowMultiline) {
            reportNoBeginningNewline(node, first, spacing);
          }
        } else if (sourceCode.isSpaceBetweenTokens(first, second)) {
          reportNoBeginningSpace(node, first);
        }
        if (isMultiline(penultimate, last)) {
          if (!config.allowMultiline) {
            reportNoEndingNewline(node, last, spacing);
          }
        } else if (sourceCode.isSpaceBetweenTokens(penultimate, last)) {
          reportNoEndingSpace(node, last);
        }
      }
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXExpressionContainer: validateBraceSpacing,
      JSXSpreadAttribute: validateBraceSpacing
    };
  }
};
