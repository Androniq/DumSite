const path = require('path');

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
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.svg$/, loader: 'svg-inline-loader' },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
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
    mode: 'development'
};