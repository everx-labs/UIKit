const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
    ...tsjPreset,
    preset: 'react-native',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest-setup.js'],
    transform: {
        ...tsjPreset.transform,
        '\\.js$': '../../node_modules/react-native/jest/preprocessor.js',
    },
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
};
