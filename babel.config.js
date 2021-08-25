module.exports = function (api) {
    api.cache(true);

    const presets = [
        'module:metro-react-native-babel-preset',
    ];
    const plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        [
            'react-native-reanimated/plugin',
            {
                globals: [
                    '_hapticImpact',
                    '_hapticSelection',
                    '_hapticNotification',
                ],
            },
        ],
    ];

    return {
        presets,
        plugins,
    };
};
