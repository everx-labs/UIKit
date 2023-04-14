module.exports = {
    setupFiles: ['<rootDir>/jest-setup.ts'],
    testEnvironment: 'node',
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    collectCoverage: true,
    collectCoverageFrom: ['./**/*.[jt]s', '!**/node_modules/**'],
    moduleFileExtensions: ['js', 'json', 'json5', 'jsx', 'ts', 'tsx'],
    roots: ['./'],
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!@react-native|react-native|@react-navigation|react-native-blob-util|jest|)',
    ],
};
