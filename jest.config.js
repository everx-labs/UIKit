const { guessRootConfig } = require('lerna-jest');


module.exports = {
    ...guessRootConfig(__dirname),
    setupFiles: [
        '<rootDir>/jest-setup.js',
    ],
    setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
    ],
    testEnvironment: 'node',
    testMatch: [
        '**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    preset: 'react-native',
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!react-navigation|react-native|rn-fetch-blob|react-native-fs|)',
    ],
    transform: {
        "\\.[jt]s?$": "babel-jest"
    },
};
