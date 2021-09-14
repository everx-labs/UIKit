const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const webpackModules = require('./webpack.js');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, './web'),
        compress: true,
        port: 4001,
        disableHostCheck: true,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __DEV__: true,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        }),
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
    ...webpackModules,
};
