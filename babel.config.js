module.exports = function (api) {
    api.cache(true);

    const presets = [
        'module:metro-react-native-babel-preset',
        '@babel/preset-flow',
    ];
    const plugins = [
        ['@babel/plugin-transform-flow-strip-types'],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['react-native-reanimated/plugin', { globals: ['_hapticImpact'] }],
    ];

    return {
        presets,
        plugins,
    };
};
