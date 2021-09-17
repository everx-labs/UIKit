module.exports = {
    setupFiles: ['<rootDir>/jest-setup.js'],
    testEnvironment: 'node',
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    collectCoverage: true,
    collectCoverageFrom: ['packages/**/*.[jt]s', '!**/node_modules/**'],
    roots: ['packages/'],
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!@react-native|react-native|@react-navigation|rn-fetch-blob|jest|)',
    ],
};
