'use strict';

var webpack = require('webpack');
var version = require('./package.json').version;

var configPlugin = new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : JSON.stringify("development")
    }
});

module.exports = {
    target : "electron-renderer",
    entry: {
        'index': __dirname + '/index.js'
    },
    output: {
        path: `./build/${version}`,
        publicPath: `build/${version}`,
        filename: '[name].js'
    },
    externals: {
        'window': 'window',
        'document': 'document',
        'wx': 'wx',
        'sql': 'SQL',
        "jquery": 'jQuery'
    },
    resolve: {
        alias: {
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015']
                }
            },
        ]

    },
    plugins: [configPlugin]
};