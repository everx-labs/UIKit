module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: '10' },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
        'module:metro-react-native-babel-preset'
    ],
    plugins: ['react-native-reanimated/plugin'],
};
