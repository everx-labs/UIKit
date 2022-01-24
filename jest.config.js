module.exports = {
    setupFiles: ['<rootDir>/jest-setup.ts'],
    testEnvironment: 'node',
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    collectCoverage: true,
    collectCoverageFrom: ['packages/**/*.[jt]s', '!**/node_modules/**'],
    moduleFileExtensions: ['js', 'json', 'json5', 'jsx', 'ts', 'tsx'],
    roots: ['packages/'],
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!@react-native|react-native|@react-navigation|rn-fetch-blob|jest|)',
    ],
};
