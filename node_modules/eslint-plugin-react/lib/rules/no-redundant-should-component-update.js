/**
 * @fileoverview Flag shouldComponentUpdate when extending PureComponent
 */
'use strict';

var Components = require('../util/Components');

function errorMessage(node) {
  return `${node} does not need shouldComponentUpdate when extending React.PureComponent.`;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Flag shouldComponentUpdate when extending PureComponent',
      category: 'Possible Errors',
      recommended: false
    },
    schema: []
  },

  create: Components.detect(function(context, components, utils) {

    /**
     * Get properties name
     * @param {Object} node - Property.
     * @returns {String} Property name.
     */
    function getPropertyName(node) {
      if (node.key) {
        return node.key.name;
      } else if (node.type === 'ClassProperty') {
        // Special case for class properties
        // (babel-eslint does not expose property name so we have to rely on tokens)
        var tokens = context.getFirstTokens(node, 2);
        return tokens[1] && tokens[1].type === 'Identifier' ? tokens[1].value : tokens[0].value;
      }
      return '';
    }

    /**
     * Get properties for a given AST node
     * @param {ASTNode} node The AST node being checked.
     * @returns {Array} Properties array.
     */
    function getComponentProperties(node) {
      switch (node.type) {
        case 'ClassExpression':
        case 'ClassDeclaration':
          return node.body.body;
        default:
          return [];
      }
    }

    /**
     * Checks for shouldComponentUpdate property
     * @param {ASTNode} node The AST node being checked.
     * @returns {Boolean} Whether or not the property exists.
     */
    function hasShouldComponentUpdate(node) {
      var properties = getComponentProperties(node);
      return properties.some(function(property) {
        var name = getPropertyName(property);
        return name === 'shouldComponentUpdate';
      });
    }

    /**
     * Get name of node if available
     * @param {ASTNode} node The AST node being checked.
     * @return {String} The name of the node
     */
    function getNodeName(node) {
      if (node.id) {
        return node.id.name;
      } else if (node.parent && node.parent.id) {
        return node.parent.id.name;
      }
      return '';
    }

    /**
     * Checks for violation of rule
     * @param {ASTNode} node The AST node being checked.
     */
    function checkForViolation(node) {
      if (utils.isPureComponent(node)) {
        var hasScu = hasShouldComponentUpdate(node);
        if (hasScu) {
          var className = getNodeName(node);
          context.report({
            node: node,
            message: errorMessage(className)
          });
        }
      }
    }

    return {
      ClassDeclaration: checkForViolation,
      ClassExpression: checkForViolation
    };
  })
};
