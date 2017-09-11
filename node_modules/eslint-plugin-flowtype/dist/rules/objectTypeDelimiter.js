'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// ported from babel/flow-object-type; original author: Nat Mote
// https://github.com/babel/eslint-plugin-babel/blob/c0a49d25a97feb12c1d07073a0b37317359a5fe5/rules/flow-object-type.js

var SEMICOLON = {
  char: ';',
  name: 'semicolon'
};

var COMMA = {
  char: ',',
  name: 'comma'
};

var create = function create(context) {
  var GOOD = void 0;
  var BAD = void 0;

  if (!context.options[0] || context.options[0] === COMMA.name) {
    GOOD = COMMA;
    BAD = SEMICOLON;
  } else {
    GOOD = SEMICOLON;
    BAD = COMMA;
  }

  var requireProperPunctuation = function requireProperPunctuation(node) {
    var tokens = context.getSourceCode().getTokens(node);
    var lastToken = tokens[tokens.length - 1];

    if (lastToken.type === 'Punctuator') {
      if (lastToken.value === BAD.char) {
        context.report({
          fix(fixer) {
            return fixer.replaceText(lastToken, GOOD.char);
          },
          message: 'Prefer ' + GOOD.name + 's to ' + BAD.name + 's in object and class types',
          node: lastToken
        });
      }
    }
  };

  return {
    ObjectTypeCallProperty: requireProperPunctuation,
    ObjectTypeIndexer: requireProperPunctuation,
    ObjectTypeProperty: requireProperPunctuation
  };
};

var schema = [{
  enum: ['semicolon', 'comma'],
  type: 'string'
}];

exports.default = {
  create,
  schema
};
module.exports = exports['default'];