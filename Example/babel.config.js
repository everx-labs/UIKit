module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
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
    ],
};
