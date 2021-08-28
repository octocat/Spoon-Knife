/**
 * @fileoverview Prevent usage of setState in lifecycle methods
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function makeNoMethodSetStateRule(methodName) {
  return {
    meta: {
      docs: {
        description: `Prevent usage of setState in ${methodName}`,
        category: 'Best Practices',
        recommended: false
      },

      schema: [{
        enum: ['disallow-in-func']
      }]
    },

    create: function(context) {

      var mode = context.options[0] || 'allow-in-func';

      // --------------------------------------------------------------------------
      // Public
      // --------------------------------------------------------------------------

      return {

        CallExpression: function(node) {
          var callee = node.callee;
          if (
            callee.type !== 'MemberExpression' ||
            callee.object.type !== 'ThisExpression' ||
            callee.property.name !== 'setState'
          ) {
            return;
          }
          var ancestors = context.getAncestors(callee).reverse();
          var depth = 0;
          for (var i = 0, j = ancestors.length; i < j; i++) {
            if (/Function(Expression|Declaration)$/.test(ancestors[i].type)) {
              depth++;
            }
            if (
              (ancestors[i].type !== 'Property' && ancestors[i].type !== 'MethodDefinition') ||
              ancestors[i].key.name !== methodName ||
              (mode !== 'disallow-in-func' && depth > 1)
            ) {
              continue;
            }
            context.report({
              node: callee,
              message: `Do not use setState in ${methodName}`
            });
            break;
          }
        }
      };

    }
  };
}

module.exports = makeNoMethodSetStateRule;
