/* eslint-disable global-require, import/no-dynamic-require */
require.extensions['.web.js'] = require.extensions['.js'];

const fs = require('fs');

const { flowTypes, exportPath } = require('./convertLocaleFileToFlowTypes');

let hasErrors = false;

function checkLanguagesConsistent() {
    const currentFlowTypes = fs.readFileSync(exportPath, { encoding: 'utf8', flag: 'r' });
    if (currentFlowTypes !== flowTypes) {
        hasErrors = true;
        console.log(
            '\x1b[31m%s\x1b[0m',
            'Flow types changed! Please, use language:sync script for fix problem.',
        );
    }

    if (hasErrors) {
        console.log(
            '\x1b[31m%s\x1b[0m',
            'Language files are not consistent, please fix before commit!',
        );
        process.exit(1);
    } else {
        console.log(
            '\x1b[32m%s\x1b[0m',
            'Languages check has succeed!',
        );
    }
}

checkLanguagesConsistent();
