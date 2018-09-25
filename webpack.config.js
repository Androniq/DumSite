const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports =
{
    entry: './src/index.js',
    output:
    {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module:
    {
        rules:
        [
            { test: /\.css$/, use:
                [
                    'isomorphic-style-loader',
                    'style-loader',
                    'css-loader'
                    /*
                    {
                      loader: 'css-loader',
                      options: { importLoaders: 1 }
                    }*/
                ]
            },
            { test: /\.svg$/, loader: 'svg-inline-loader' },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use:
                [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
                    },
                    /*{
                        loader: 'react-proxy-loader'
                    }*/
                ]
            }
        ]
    },
    plugins:
    [
        new CopyWebpackPlugin([{ from: 'public/', to: '' }], {})
    ],
    mode: 'development'
};