/**
 * @fileoverview Enforce props alphabetical sorting
 * @author Ilya Volodin, Yannick Croissant
 */
'use strict';

var elementType = require('jsx-ast-utils/elementType');
var propName = require('jsx-ast-utils/propName');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isCallbackPropName(name) {
  return /^on[A-Z]/.test(name);
}

var COMPAT_TAG_REGEX = /^[a-z]|\-/;
function isDOMComponent(node) {
  var name = elementType(node);

  // Get namespace if the type is JSXNamespacedName or JSXMemberExpression
  if (name.indexOf(':') > -1) {
    name = name.substring(0, name.indexOf(':'));
  } else if (name.indexOf('.') > -1) {
    name = name.substring(0, name.indexOf('.'));
  }

  return COMPAT_TAG_REGEX.test(name);
}

var RESERVED_PROPS_LIST = [
  'children',
  'dangerouslySetInnerHTML',
  'key',
  'ref'
];

function isReservedPropName(name, list) {
  return list.indexOf(name) >= 0;
}

/**
 * Checks if the `reservedFirst` option is valid
 * @param {Object} context The context of the rule
 * @param {Boolean|Array<String>} reservedFirst The `reservedFirst` option
 * @return {?Function} If an error is detected, a function to generate the error message, otherwise, `undefined`
 */
// eslint-disable-next-line consistent-return
function validateReservedFirstConfig(context, reservedFirst) {
  if (reservedFirst) {
    if (Array.isArray(reservedFirst)) {
      // Only allow a subset of reserved words in customized lists
      // eslint-disable-next-line consistent-return
      var nonReservedWords = reservedFirst.filter(function(word) {
        if (!isReservedPropName(word, RESERVED_PROPS_LIST)) {
          return true;
        }
      });

      if (reservedFirst.length === 0) {
        return function(decl) {
          context.report({
            node: decl,
            message: 'A customized reserved first list must not be empty'
          });
        };
      } else if (nonReservedWords.length > 0) {
        return function(decl) {
          context.report({
            node: decl,
            message: 'A customized reserved first list must only contain a subset of React reserved props.' +
              ' Remove: {{ nonReservedWords }}',
            data: {
              nonReservedWords: nonReservedWords.toString()
            }
          });
        };
      }
    }
  }
}

module.exports = {
  meta: {
    docs: {
      description: 'Enforce props alphabetical sorting',
      category: 'Stylistic Issues',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        // Whether callbacks (prefixed with "on") should be listed at the very end,
        // after all other props. Supersedes shorthandLast.
        callbacksLast: {
          type: 'boolean'
        },
        // Whether shorthand properties (without a value) should be listed first
        shorthandFirst: {
          type: 'boolean'
        },
        // Whether shorthand properties (without a value) should be listed last
        shorthandLast: {
          type: 'boolean'
        },
        ignoreCase: {
          type: 'boolean'
        },
        // Whether alphabetical sorting should be enforced
        noSortAlphabetically: {
          type: 'boolean'
        },
        reservedFirst: {
          type: ['array', 'boolean']
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {

    var configuration = context.options[0] || {};
    var ignoreCase = configuration.ignoreCase || false;
    var callbacksLast = configuration.callbacksLast || false;
    var shorthandFirst = configuration.shorthandFirst || false;
    var shorthandLast = configuration.shorthandLast || false;
    var noSortAlphabetically = configuration.noSortAlphabetically || false;
    var reservedFirst = configuration.reservedFirst || false;
    var reservedFirstError = validateReservedFirstConfig(context, reservedFirst);
    var reservedList = Array.isArray(reservedFirst) ? reservedFirst : RESERVED_PROPS_LIST;

    return {
      JSXOpeningElement: function(node) {
        // `dangerouslySetInnerHTML` is only "reserved" on DOM components
        if (reservedFirst && !isDOMComponent(node)) {
          reservedList = reservedList.filter(function(prop) {
            return prop !== 'dangerouslySetInnerHTML';
          });
        }

        node.attributes.reduce(function(memo, decl, idx, attrs) {
          if (decl.type === 'JSXSpreadAttribute') {
            return attrs[idx + 1];
          }

          var previousPropName = propName(memo);
          var currentPropName = propName(decl);
          var previousValue = memo.value;
          var currentValue = decl.value;
          var previousIsCallback = isCallbackPropName(previousPropName);
          var currentIsCallback = isCallbackPropName(currentPropName);

          if (ignoreCase) {
            previousPropName = previousPropName.toLowerCase();
            currentPropName = currentPropName.toLowerCase();
          }

          if (reservedFirst) {
            if (reservedFirstError) {
              reservedFirstError(decl);
              return memo;
            }

            var previousIsReserved = isReservedPropName(previousPropName, reservedList);
            var currentIsReserved = isReservedPropName(currentPropName, reservedList);

            if (previousIsReserved && currentIsReserved) {
              if (!noSortAlphabetically && currentPropName < previousPropName) {
                context.report({
                  node: decl,
                  message: 'Props should be sorted alphabetically'
                });
                return memo;
              }
              return decl;
            }
            if (!previousIsReserved && currentIsReserved) {
              context.report({
                node: decl,
                message: 'Reserved props must be listed before all other props'
              });
              return memo;
            }
            return decl;
          }

          if (callbacksLast) {
            if (!previousIsCallback && currentIsCallback) {
              // Entering the callback prop section
              return decl;
            }
            if (previousIsCallback && !currentIsCallback) {
              // Encountered a non-callback prop after a callback prop
              context.report({
                node: memo,
                message: 'Callbacks must be listed after all other props'
              });
              return memo;
            }
          }

          if (shorthandFirst) {
            if (currentValue && !previousValue) {
              return decl;
            }
            if (!currentValue && previousValue) {
              context.report({
                node: memo,
                message: 'Shorthand props must be listed before all other props'
              });
              return memo;
            }
          }

          if (shorthandLast) {
            if (!currentValue && previousValue) {
              return decl;
            }
            if (currentValue && !previousValue) {
              context.report({
                node: memo,
                message: 'Shorthand props must be listed after all other props'
              });
              return memo;
            }
          }

          if (!noSortAlphabetically && currentPropName < previousPropName) {
            context.report({
              node: decl,
              message: 'Props should be sorted alphabetically'
            });
            return memo;
          }

          return decl;
        }, node.attributes[0]);
      }
    };
  }
};
