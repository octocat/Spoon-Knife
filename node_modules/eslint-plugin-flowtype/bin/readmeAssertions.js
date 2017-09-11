/**
 * This script is used to inline assertions into the README.md documents.
 */
import _ from 'lodash';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

const formatCodeSnippet = (setup) => {
    const paragraphs = [];

    if (setup.options) {
        paragraphs.push('// Options: ' + JSON.stringify(setup.options));
    }

    paragraphs.push(setup.code);

    if (setup.errors) {
        setup.errors.forEach((message) => {
            paragraphs.push('// Message: ' + message.message);
        });
    }

    if (setup.rules) {
        paragraphs.push('// Additional rules: ' + JSON.stringify(setup.rules));
    }

    return paragraphs.join('\n');
};

const getAssertions = () => {
    const assertionFiles = glob.sync(path.resolve(__dirname, './../tests/rules/assertions/*.js'));

    const assertionNames = _.map(assertionFiles, (filePath) => {
        return path.basename(filePath, '.js');
    });

    const assertionCodes = _.map(assertionFiles, (filePath) => {
        const codes = require(filePath);

        return {
            valid: _.map(codes.valid, formatCodeSnippet),
            invalid: _.map(codes.invalid, formatCodeSnippet)
        };
    });

    return _.zipObject(assertionNames, assertionCodes);
};

const updateDocuments = (assertions) => {
    const readmeDocumentPath = path.join(__dirname, './../README.md');

    let documentBody = fs.readFileSync(readmeDocumentPath, 'utf8');

    documentBody = documentBody.replace(/<!-- assertions ([a-z]+?) -->/ig, (assertionsBlock) => {
        let exampleBody;

        const ruleName = assertionsBlock.match(/assertions ([a-z]+)/i)[1];

        const ruleAssertions = assertions[ruleName];

        if (!ruleAssertions) {
            throw new Error('No assertions available for rule "' + ruleName + '".');

            return assertionsBlock;
        }

        exampleBody = '';

        if (ruleAssertions.invalid.length) {
            exampleBody += 'The following patterns are considered problems:\n\n```js\n' + ruleAssertions.invalid.join('\n\n') + '\n```\n\n';
        }

        if (ruleAssertions.valid.length) {
            exampleBody += 'The following patterns are not considered problems:\n\n```js\n' + ruleAssertions.valid.join('\n\n') + '\n```\n\n';
        }

        return exampleBody;
    });

    fs.writeFileSync(readmeDocumentPath, documentBody);
};

updateDocuments(getAssertions());
