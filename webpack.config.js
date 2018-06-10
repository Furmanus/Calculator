const path = require('path');

module.exports = {
    entry: './src/ts/entry.ts',
    devtool: "eval-source-map",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    }
};