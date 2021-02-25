const fs = require('fs');
const prettier = require('prettier');
const jsonToFlow = require('json-to-flowtype-generator');

const dictionary = require('../packages/localization/src/languages/en.json');

export const exportPath = 'packages/localization/src/languages/types.js';

const types = jsonToFlow(dictionary, { name: 'UILocalizedData' });

const content = `
    // @flow

    export ${types}
`;
export const flowTypes = prettier.format(content, { tabWidth: 4 });

export function updateTypesFile() {
    // eslint-disable-next-line consistent-return
    fs.writeFileSync(exportPath, flowTypes, { flag: 'w' }, err => {
        if (err) return console.log(err);
        console.log('Writing flow types to types.js file');
    });
}
