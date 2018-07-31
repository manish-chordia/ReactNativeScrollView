var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var path = require('path');
var EmitStatsPlugin = require('./webpack/emit-stats-plugin');

var DEV = process.env.NODE_ENV !== 'production';
var PROD = !DEV;
var APP_NAME = require('./package.json').name;
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    entry: PROD
        ? {
              app: ['./index.web.js'],
              vendor: ['fk-react-native-web'],
              commonVendor: ['react-dom', 'prop-types', 'whatwg-fetch', 'es6-set'],
          }
        : {
              app: ['whatwg-fetch', './index.web.js'],
          },
    output: {
        path: DEV ? path.join(__dirname, 'bundle') : path.join(__dirname, 'bundle', APP_NAME),
        filename: PROD ? 'app.[chunkhash].js' : 'bundle.js',
        //#if [RELEASE]
        // publicPath: '/images/',
        // pathinfo: !PROD,
        // chunkFilename: '[name].[chunkhash].js',
        // jsonpFunction: 'webpackJsonp',
        //#endif
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(recyclerlistview|react-native-web-scrollable-tab-header|react-native-web-circular-progress|react-native-web-modalbox|react-native-web-tabview|fk-react-native-sdk|fk-rn-shared)\/).*/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties'],
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: PROD ? 'url-loader?limit=10&name=images/[name]-[hash:8].[ext]' : 'url-loader?limit=10&name=images/[name].[ext]',
            },
        ],
    },
    plugins: PROD
        ? [
              new webpack.optimize.CommonsChunkPlugin({
                  name: 'commonVendor',
                  filename: 'commonVendor.[chunkhash].js',
                  minChunks: Infinity,
              }),
              new webpack.optimize.CommonsChunkPlugin({
                  name: 'vendor',
                  filename: 'vendor.[chunkhash].js',
                  chunks: ['vendor', 'app'],
                  minChunks: Infinity,
              }),
              new webpack.DefinePlugin({
                  PLATFORM: JSON.stringify('web'),
                  'process.env.NODE_ENV': JSON.stringify('production'),
              }),
              new webpack.optimize.ModuleConcatenationPlugin(),

              new webpack.optimize.UglifyJsPlugin({
                  compress: {
                      warnings: false,
                      screw_ie8: true,
                      conditionals: true,
                      unused: true,
                      comparisons: true,
                      sequences: true,
                      dead_code: true,
                      evaluate: true,
                      if_return: true,
                      join_vars: true,
                      drop_console: true,
                  },
                  output: {
                      comments: false,
                  },
              }),
              new CompressionPlugin({
                  asset: '[path][query]',
                  algorithm: 'gzip',
                  test: /\.js$|\.svg$/,
              }),
              new EmitStatsPlugin({
                  filename: 'versions.json',
              }),
              new EmitStatsPlugin({
                  filename: 'current.version',
              }),
              /*new BundleAnalyzerPlugin({analyzerMode: 'static'})*/
          ]
        : [
              new webpack.DefinePlugin({
                  PLATFORM: JSON.stringify('web'),
                  'process.env.NODE_ENV': JSON.stringify('development'),
              }),
              new EmitStatsPlugin({
                  filename: 'versions.json',
              }),
              new EmitStatsPlugin({
                  filename: 'current.version',
              }),
          ],
    resolve: {
        // Maps the 'react-native' import to 'react-native-web'.
        alias: {
            'react-native': 'fk-react-native-web',
            'react-art': 'react-art-fiber',
            reactnativetabview: 'react-native-web-tabview',
            'react-native-modalbox': 'react-native-web-modalbox',
            recyclerlistview: 'recyclerlistview/web',
        },
        extensions: ['.web.js', '.js', '.json', '.android.js'],
    },
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        compress: true,
        proxy: {
            '/api': {
                target: 'https://www.flipkart.com',
                // ignorePath: true,
                changeOrigin: true,
                // secure: true
            },
        },
        historyApiFallback: {
            rewrites: [
                {
                    from: /\/rv\/index.html/,
                    to: 'index.html',
                },
            ],
        },
    },
};
