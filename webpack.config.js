const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';

const config = {
    stats: {
        children: false
    },
    entry: './src/App.js',
    output: {
        filename: 'app.js',
        chunkFilename: 'app.[id].js',
        path: path.resolve(process.cwd(), 'public'),
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                include: [path.resolve(process.cwd(), 'node_modules')],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: 'global'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: [path.resolve(process.cwd(), 'src')],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: 'local',
                                localIdentName: PROD
                                    ? '[hash:base64:6]'
                                    : '[name]_[local]_[hash:base64:6]'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.sql$/,
                use: 'raw-loader'
            }
        ]
    },
    mode: PROD ? 'production' : 'development',
    devtool: PROD ? false : 'source-map',
    resolve: {
        alias: {
            'sql.js': PROD
                ? path.resolve(process.cwd(), './node_modules/sql.js/dist/sql-wasm.js')
                : path.resolve(process.cwd(), './node_modules/sql.js/dist/sql-wasm-debug.js')
        }
    },
    target: 'web',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new HTMLWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html' // keep in sync with output.publicPath
        }),
        new CopyWebpackPlugin([
            {
                from: PROD
                    ? './node_modules/sql.js/dist/sql-wasm.wasm'
                    : './node_modules/sql.js/dist/sql-wasm-debug.wasm',
                to: './'
            }
        ])
    ],
    node: {
        fs: 'empty'
    }
};

module.exports = config;
