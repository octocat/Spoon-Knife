/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: 'Validate closing tag location for multiline JSX',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace'
  },

  create: function(context) {
    var sourceCode = context.getSourceCode();

    /**
     * Checks if the node is the first in its line, excluding whitespace.
     * @param {ASTNode} node The node to check
     * @return {Boolean} true if its the first node in its line
     */
    function isNodeFirstInLine(node) {
      let token = node;
      let lines;
      do {
        token = sourceCode.getTokenBefore(token);
        lines = token.type === 'JSXText'
          ? token.value.split('\n')
          : null;
      } while (
        token.type === 'JSXText' &&
        /^\s*$/.test(lines[lines.length - 1])
      );

      var startLine = node.loc.start.line;
      var endLine = token ? token.loc.end.line : -1;
      return startLine !== endLine;
    }

    return {
      JSXClosingElement: function(node) {
        if (!node.parent) {
          return;
        }

        const opening = node.parent.openingElement;
        if (opening.loc.start.line === node.loc.start.line) {
          return;
        }

        if (opening.loc.start.column === node.loc.start.column) {
          return;
        }

        let message;
        if (!isNodeFirstInLine(node)) {
          message = 'Closing tag of a multiline JSX expression must be on its own line.';
        } else {
          message = 'Expected closing tag to match indentation of opening.';
        }

        context.report({
          node: node,
          loc: node.loc,
          message,
          fix: function(fixer) {
            const indent = Array(opening.loc.start.column + 1).join(' ');
            if (isNodeFirstInLine(node)) {
              return fixer.replaceTextRange(
                [node.start - node.loc.start.column, node.start],
                indent
              );
            }

            return fixer.insertTextBefore(node, `\n${indent}`);
          }
        });
      }
    };
  }
};
