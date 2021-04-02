module.exports = function (api) {
    api.cache(true);

    const presets = [
        'module:metro-react-native-babel-preset',
        '@babel/preset-flow',
        'react-native',
        ['@babel/preset-env', {targets: {node: 'current'}}]
    ];
    const plugins = [
        ['@babel/plugin-transform-flow-strip-types'],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-transform-spread', { loose: true }],
        [
            'module-resolver',
            {
                alias: {
                    '@tonlabs/uikit.assets': './packages/assets/src', // UIKit assets
                    '@tonlabs/uikit.core': './packages/core/src', // UIKit core
                    '@tonlabs/uikit.components': './packages/components/src', // UIKit components
                    '@tonlabs/uikit.chats': './packages/chats/src', // UIKit chats
                    '@tonlabs/uikit.navigation_legacy': './packages/navigation_legacy/src', // UIKit navigation legacy
                    '@tonlabs/uikit.navigation': './packages/navigation/src', // UIKit navigation
                    '@tonlabs/uikit.legacy': './packages/legacy/src', // UIKit legacy
                    '@tonlabs/uikit.localization': './packages/localization/src', // UIKit localization
                    '@tonlabs/uikit.hydrogen': './packages/hydrogen/src', // UIKit hydrogen
                    '@tonlabs/uikit.keyboard': './packages/keyboard/src', // UIKit keyboard
                    '@tonlabs/uikit.stickers': './packages/stickers/src', // UIKit stickers
                    '@tonlabs/uikit.browser': './packages/browser/src', // UIKit browser
                    '@tonlabs/uikit.flask': './packages/flask/src', // UIKit flask
                },
            },
        ],
    ];

    return {
        presets,
        plugins,
    };
};
