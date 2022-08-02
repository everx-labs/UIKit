module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        '@tonlabs/babel-plugin-transform-inline-consts',
        [
            'react-native-reanimated/plugin',
            {
                globals: [
                    '_hapticImpact',
                    '_hapticSelection',
                    '_hapticNotification',
                    '_injectInputValue',
                    '_moveInputCaret',
                    '_uiKitInputBinder',
                ],
            },
        ],
        ['transform-react-remove-prop-types', { mode: 'wrap' }],
    ],
};
