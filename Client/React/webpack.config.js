
const path = require("path");

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../wwwroot/js'),
        filename: "my_lib.js",
        library: "ReactLib"
    }
};

// const path = require("path");

// module.exports = {
    
//     entry: './app/index.jsx',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'index_bundle.js'
//     },
    
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: "babel-loader"
//                 }
//             }
//         ]
//     },
//     output: {
//         path: path.resolve(__dirname, '../wwwroot/js'),
//         filename: "my_lib.js",
//         library: "MyLib"
//     }
//     // ,
//     // plugins: [
//     //     new HtmlWebpackPlugin({
//     //         template: 'app/index.html'
//     //     })
//     // ]

// };