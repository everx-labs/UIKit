module.exports = {
    setupFiles: [
      '<rootDir>/jest-setup.js'
    ],
    setupFilesAfterEnv: [
        '@testing-library/react-native/cleanup-after-each',
    ],
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/*/*.[jt]s?(x)',
    ],
    preset: '@testing-library/react-native',
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!react-navigation|react-native|rn-fetch-blob|react-native-fs|jest|)',
    ],
};
