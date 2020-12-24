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
                test: /\.jsx?$/,
                // exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, './index.web.js'),
                    path.resolve(__dirname, './App.js'),
                    path.resolve(__dirname, './src/'),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-web/'
                    ),
                    // path.resolve(__dirname, "../UIKit.js"),
                    path.resolve(__dirname, '../packages/'),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-indicators/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-dropdownalert/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-lightbox/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-simple-popover/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-flash-message/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-country-picker-modal/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-awesome-alerts/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-parsed-text/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-fast-image/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-qrcode-svg/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-gesture-handler/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-share/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-safe-area/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-navigation-surf/'
                    ),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-document-picker/'
                    ),
                    path.resolve(__dirname, '../node_modules/rn-fetch-blob/'),
                    path.resolve(
                        __dirname,
                        '../node_modules/react-native-ui-lib/'
                    ),
                ],
                loader: 'babel-loader',
                query: {
                    // cacheDirectory: true,
                    presets: [
                        '@babel/preset-flow',
                        '@babel/preset-react',
                        [
                            '@babel/preset-env',
                            {
                                loose: true,
                                exclude: ['transform-typeof-symbol'],
                                targets: '> 0.25%, not dead',
                            },
                        ],
                    ],
                    plugins: [
                        'babel-plugin-react-native-web',
                        '@babel/plugin-transform-flow-strip-types',
                        [
                            'babel-plugin-transform-react-remove-prop-types',
                            { mode: 'wrap' },
                        ],
                        [
                            '@babel/plugin-proposal-class-properties',
                            { loose: true },
                        ],
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
        extensions: ['.web.js', '.js', '.json'],
        alias: {
            '@react-native-community/async-storage':
                'react-native-web/dist/exports/AsyncStorage',
            'react-native/Libraries/ReactNative/AppContainer':
                'react-native-web/dist/exports/AppRegistry/AppContainer',
            'react-native/Libraries/Text/TextAncestor':
                'react-native-web/dist/exports/Text/TextAncestorContext',
            'react-native$': 'react-native-web',
            'react-native-safe-area': 'react', // Hack in order not to load
            'react-native-lightbox': 'react', // Hack in order not to load
            'react-native-localization': 'react-localization',
            'react-native-ui-lib/keyboard': 'react', // Hack in order not to load
            'react-native-document-picker': 'react', // Hack in order not to load
            'rn-fetch-blob': 'react', // Hack in order not to load
        },
    },
};
