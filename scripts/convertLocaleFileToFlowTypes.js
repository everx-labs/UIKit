const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require('prettier');
const jsonToFlow = require('json-to-flowtype-generator');

const dictionary = require('../helpers/UILocalized/en.json');

const exportPath = 'helpers/UILocalized/types.js';

const types = jsonToFlow(dictionary, { name: 'UILocalizedData' });

const content = `
    // @flow

    export ${types}
`;

// eslint-disable-next-line consistent-return
fs.writeFile(exportPath, prettier.format(content, { tabWidth: 4 }), { flag: 'w' }, (err) => {
    if (err) return console.log(err);
    console.log('Writing flow types to types.js file');
});
