// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/*/*.[jt]s?(x)',
    ],
    preset: '@testing-library/react-native',
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!react-navigation|react-native|rn-fetch-blob|react-native-fs|jest|)',
    ],
};
