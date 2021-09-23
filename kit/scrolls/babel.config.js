module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        '@tonlabs/plugins.babel-plugin-transform-inline-consts',
        'react-native-reanimated/plugin',
    ],
};
