module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        '@babel/plugin-proposal-export-namespace-from',
        '@tonlabs/babel-plugin-transform-inline-consts',
        [
            'react-native-reanimated/plugin',
            {
                globals: ['_hapticImpact', '_hapticSelection', '_hapticNotification'],
            },
        ],
        ['transform-react-remove-prop-types', { mode: 'wrap' }],
    ],
};
