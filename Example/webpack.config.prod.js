const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, './web'),
        compress: true,
        port: 4001,
        disableHostCheck: true,
        historyApiFallback: true,
    },
    entry: path.join(__dirname, './index.web.js'),
    output: {
        path: path.join(__dirname, './web/assets'),
        publicPath: 'assets/',
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            __DEV__: false,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            // exclude: /node_modules/,
            // include specif   ic files based on a RegExp
            // include: /src/,
            // add errors to webpack instead of warnings
            failOnError: false,
            // allow import cycles that include an asynchronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            maxDepth: 2,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        }),
    ],
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
                    path.resolve(__dirname, '../node_modules/react-native-indicators/'),
                    path.resolve(__dirname, '../node_modules/react-native-dropdownalert/'),
                    path.resolve(__dirname, '../node_modules/react-native-lightbox/'),
                    path.resolve(__dirname, '../node_modules/react-native-simple-popover/'),
                    path.resolve(__dirname, '../node_modules/react-native-flash-message/'),
                    path.resolve(__dirname, '../node_modules/react-native-country-picker-modal/'),
                    path.resolve(__dirname, '../node_modules/react-native-awesome-alerts/'),
                    path.resolve(__dirname, '../node_modules/react-native-parsed-text/'),
                    path.resolve(__dirname, '../node_modules/react-native-fast-image/'),
                    path.resolve(__dirname, '../node_modules/react-native-gesture-handler/'),
                    path.resolve(__dirname, '../node_modules/react-native-share/'),
                    path.resolve(__dirname, '../node_modules/react-navigation-surf/'),
                    path.resolve(__dirname, '../node_modules/react-native-document-picker/'),
                    path.resolve(__dirname, '../node_modules/rn-fetch-blob/'),
                    path.resolve(__dirname, '../node_modules/react-native-reanimated/'),
                    path.resolve(__dirname, '../node_modules/react-native-view-shot/'),
                    path.resolve(__dirname, '../node_modules/react-native-modern-datepicker'),
                ],
                loader: 'babel-loader',
                query: {
                    // cacheDirectory: true,
                    presets: [
                        '@babel/preset-flow',
                        'module:metro-react-native-babel-preset',
                    ],
                    plugins: [
                        'babel-plugin-react-native-web',
                        '@babel/plugin-transform-flow-strip-types',
                        ['babel-plugin-transform-react-remove-prop-types', { mode: 'wrap' }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        'react-native-reanimated/plugin',
                    ],
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
        ],
        alias: {
            '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage',
            'react-native/Libraries/ReactNative/AppContainer':
                'react-native-web/dist/exports/AppRegistry/AppContainer',
            'react-native/Libraries/Text/TextAncestor':
                'react-native-web/dist/exports/Text/TextAncestorContext',
            'react-native/Libraries/Components/View/ReactNativeStyleAttributes': 'react',
            'react-native/Libraries/Animated/SpringConfig':
                'react-native-web/dist/vendor/react-native/Animated/SpringConfig',
            'react-native$': 'react-native-web',
            'react-native-lightbox': 'react', // Hack in order not to load
            'react-native-localization': 'react-localization',
            'react-native-document-picker': 'react', // Hack in order not to load
            'rn-fetch-blob': 'react', // Hack in order not to load
            'react-native-camera': 'react', // Hack in order not to load
            'react-native-permissions': 'react', // Hack in order not to load
            'react-native-qrcode-scanner': 'react', // Hack in order not to load
        },
    },
};
