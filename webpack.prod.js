const HtmlWebpackPlugin = require('html-webpack-plugin'); //trasladar el template del index al dist
const MiniCssExtractPlugin= require('mini-css-extract-plugin'); // trasladar el css global al dist

const CssMinimizeWebPackPlugin= require('css-minimizer-webpack-plugin'); // minimizar el css global del dist

const CopyWebPackPlugin= require('copy-webpack-plugin'); //copiar carpetas estaticas al dist

const TerserPlugin = require("terser-webpack-plugin"); // empaquetaata archivos js para ser compatible con versiones viejas, ademas de que lo minimize
module.exports={
    mode:'production',
    optimization: {
        minimizer: [
          new CssMinimizeWebPackPlugin(),
        ],
    },
    output:{
        filename: 'main.[chunkhash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
           
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options:{
                    sources: false,
                    minimize: false,
                },
                
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /styles\.css$/i,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use:[
                    {
                        loader: 'file-loader',
                        options:{
                            esModule: false,
                        }
                    }
                ]
            }       
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
            ignoreOrder: false,
        }),
        new CopyWebPackPlugin({
            patterns:[
                {from : 'src/assets' , to:'assets/'}
            ]
        }),
        new TerserPlugin() 
    ] 
}