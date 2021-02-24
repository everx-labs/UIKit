/* eslint-disable global-require, import/no-dynamic-require */
require.extensions['.web.js'] = require.extensions['.js'];

const fs = require('fs');

const pathToLanguagesDir = 'packages/localization/src/languages/';
const pathToLanguages = '../'.concat(pathToLanguagesDir);

const { updateTypesFile } = require('./convertLocaleFileToFlowTypes');

const errors = [];
let hasErrors = false;

/**
 *
 * @param original {Object}
 * @param target {Object}
 * @param keyPath {string}
 * @returns {Object}
 */
function makeConsistent(original, target, keyPath = '') {
    const exObject = { ...target };
    Object.keys(original).forEach(key => {
        const originalValue = original[key];
        const targetValue = target[key];

        if (!(key in target)) {
            exObject[key] = original[key];
            console.log(`Key "${key}" added to "${keyPath || 'root'}"`);
        } else if (typeof originalValue !== typeof targetValue) {
            exObject[key] = original[key];
            console.log(`Key "${key}" replaced in "${keyPath}"`);
        } else if (Array.isArray(targetValue)) {
            if (originalValue.length !== targetValue.length) {
                console.log(
                    '\x1b[33m%s\x1b[0m',
                    `Data length in target on "${keyPath.concat('.', key)}" not equals!`,
                );
                errors.push(`Error in ${keyPath.concat('.', key)}`);
            }
        } else if (typeof originalValue === 'object') {
            exObject[key] = makeConsistent(originalValue, targetValue, keyPath.concat(keyPath ? '.' : '', key));
        }
    });

    return exObject;
}

function makeLanguageConsistent() {
    const languages = fs.readdirSync(pathToLanguagesDir)
        .filter(file => file.includes('.json'))
        .map(lang => lang.replace('.json', ''));

    console.info(languages);
    const mainLanguage = 'en';

    const translations = languages.filter(language => language !== mainLanguage);

    const translationsConfig = {
        main: {
            name: mainLanguage,
            path: pathToLanguagesDir.concat(mainLanguage, '.json'),
            file: require(pathToLanguages.concat(mainLanguage, '.json')),
        },
        translations: translations.map(language => ({
            name: language,
            path: pathToLanguagesDir.concat(language, '.json'),
            file: require(pathToLanguages.concat(language, '.json')),
        })),
    };

    translationsConfig.translations.forEach(translation => {
        errors.length = 0;
        console.log('\x1b[34m\x1b[1m%s\x1b[0m', `Syncing ${translation.name} file...`);
        const translationFile = translation.file;
        const processedFile = makeConsistent(translationsConfig.main.file, translationFile);
        const content = JSON.stringify(processedFile, null, 4);

        fs.writeFileSync(
            translation.path,
            content,
            { flag: 'w' },
            err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Writing ${translation.name} language to ${translation.path}`);
                }
            },
        );

        if (!errors.length) {
            console.log('\x1b[0;32m%s\x1b[0m', `Language ${translation.name} sync succeed`);
        } else {
            hasErrors = true;
            console.log('\x1b[1;31m%s\x1b[0m', `Language ${translation.name} has critical difference!`);
        }
    });

    updateTypesFile();

    if (hasErrors) {
        console.log(
            '\x1b[31m%s\x1b[0m',
            'Changes has critical difference, please fix before save!',
        );
        process.exit(1);
    } else {
        console.log(
            '\x1b[32m%s\x1b[0m',
            'Sync succeed!',
        );
    }
}

makeLanguageConsistent();
