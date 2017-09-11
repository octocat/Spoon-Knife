/**
 * @fileoverview Forbid target='_blank' attribute
 * @author Kevin Miller
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isTargetBlank(attr) {
  return attr.name.name === 'target' &&
    attr.value.type === 'Literal' &&
    attr.value.value.toLowerCase() === '_blank';
}

function hasExternalLink(element) {
  return element.attributes.find(function (attr) {
    return attr.name &&
      attr.name.name === 'href' &&
      attr.value.type === 'Literal' &&
      /^(?:\w+:|\/\/)/.test(attr.value.value);
  });
}

function hasSecureRel(element) {
  return element.attributes.find(function (attr) {
    if (attr.name.name === 'rel') {
      var tags = attr.value.type === 'Literal' && attr.value.value.toLowerCase().split(' ');
      return !tags || (tags.indexOf('noopener') >= 0 && tags.indexOf('noreferrer') >= 0);
    }
    return false;
  });
}

module.exports = {
  meta: {
    docs: {
      description: 'Forbid target="_blank" attribute without rel="noopener noreferrer"',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {
    return {
      JSXAttribute: function(node) {
        if (node.parent.name.name !== 'a') {
          return;
        }

        if (
          isTargetBlank(node) &&
          hasExternalLink(node.parent) &&
          !hasSecureRel(node.parent)
        ) {
          context.report(node, 'Using target="_blank" without rel="noopener noreferrer" ' +
          'is a security risk: see https://mathiasbynens.github.io/rel-noopener');
        }
      }
    };
  }
};
