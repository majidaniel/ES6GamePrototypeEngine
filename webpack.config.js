var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './src/app.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'app.bundle.js'
     },
     module: {
         rules: [
            { test: /\.js$/, exclude: [/node_modules/,/build/], loader: "babel-loader" }
         ]
     },
     stats: {
         colors: true
     },
     watchOptions: {
         ignored: [/node_modules/,/build/]
     },
     devtool: 'source-map'
 };