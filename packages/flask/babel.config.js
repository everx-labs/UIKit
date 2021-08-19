module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: '10' },
            },
        ],
        '@babel/preset-typescript',
        '@babel/preset-react',
    ],
    plugins: ['@tonlabs/babel-plugin-transform-inline-consts', 'react-native-reanimated/plugin'],
};
