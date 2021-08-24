module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: '10' },
            },
        ],
        'module:metro-react-native-babel-preset',
    ],
    plugins: ['react-native-reanimated/plugin'],
};
