module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: '10' },
            },
        ],
        'module:metro-react-native-babel-preset',
        '@babel/preset-react',
    ],
    plugins: ['@tonlabs/babel-plugin-transform-inline-consts', 'react-native-reanimated/plugin'],
};
