'use strict';
let path = require("path");

module.exports = {
    target : "electron-renderer",
    entry: {
        'index': path.resolve(__dirname, 'index.js')
    },
    output: {
        path: './build',
        filename: '[name].js'
    },
    externals: {
        "jquery": 'jQuery'
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

    }
};