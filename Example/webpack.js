const path = require('path');

module.exports = {
    entry: path.join(__dirname, './index.web.js'),
    output: {
        path: path.join(__dirname, './web/assets'),
        publicPath: 'assets/',
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                // exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, './index.web.js'),
                    path.resolve(__dirname, './src/'),
                    path.resolve(__dirname, '../node_modules/react-native-web/'),
                    // path.resolve(__dirname, "../UIKit.js"),
                    path.resolve(__dirname, '../packages/'),
                    path.resolve(__dirname, '../kit/'),
                    path.resolve(__dirname, '../casts/'),
                    path.resolve(__dirname, '../stories/'),
                    path.resolve(__dirname, '../plugins/'),
                    path.resolve(__dirname, '../localization/'),
                    path.resolve(__dirname, '../node_modules/react-native-indicators/'),
                    path.resolve(__dirname, '../node_modules/react-native-simple-popover/'),
                    path.resolve(__dirname, '../node_modules/react-native-country-picker-modal/'),
                    path.resolve(__dirname, '../node_modules/react-native-awesome-alerts/'),
                    path.resolve(__dirname, '../node_modules/react-native-parsed-text/'),
                    path.resolve(__dirname, '../node_modules/react-native-fast-image/'),
                    path.resolve(__dirname, '../node_modules/react-native-gesture-handler/'),
                    path.resolve(__dirname, '../node_modules/react-native-share/'),
                    path.resolve(__dirname, '../node_modules/react-native-document-picker/'),
                    path.resolve(__dirname, '../node_modules/rn-fetch-blob/'),
                    path.resolve(__dirname, '../node_modules/react-native-reanimated/'),
                    path.resolve(__dirname, '../node_modules/react-native-view-shot/'),
                    path.resolve(__dirname, '../node_modules/react-native-web-linear-gradient/'),
                ],
                loader: 'babel-loader',
                query: {
                    // cacheDirectory: true,
                    plugins: ['babel-plugin-react-native-web'],
                },
            },
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                loader: 'react-native-web-image-loader', // 'url-loader',
                options: {
                    name: '[name].[hash:8].[ext]',
                    esModule: false,
                    publicPath: '/assets',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.woff2?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:8].[ext]',
                    esModule: false,
                    publicPath: '/assets',
                },
            },
        ],
    },
    resolve: {
        extensions: [
            '.web.tsx',
            '.web.ts',
            '.web.jsx',
            '.web.js',
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.node',
            '.wasm',
        ],
        alias: {
            'react-native/Libraries/ReactNative/AppContainer':
                'react-native-web/dist/exports/AppRegistry/AppContainer',
            'react-native/Libraries/Text/TextAncestor':
                'react-native-web/dist/exports/Text/TextAncestorContext',
            'react-native/Libraries/Animated/SpringConfig':
                'react-native-web/dist/vendor/react-native/Animated/SpringConfig',
            'react-native/Libraries/Components/View/ReactNativeStyleAttributes': 'react',
            'react-native': 'react-native-web',
            'react-native-localization': 'react-localization',
            'react-native-document-picker': 'react', // Hack in order not to load
            'rn-fetch-blob': 'react', // Hack in order not to load
            'react-native-camera': 'react', // Hack in order not to load
            'react-native-permissions': 'react', // Hack in order not to load
            'react-native-qrcode-scanner': 'react', // Hack in order not to load
            'react-native-linear-gradient': 'react-native-web-linear-gradient',
        },
    },
};
