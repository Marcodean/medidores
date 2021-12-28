const HtmlWebpackPlugin = require('html-webpack-plugin'); //trasladar el template del index al dist
const MiniCssExtractPlugin= require('mini-css-extract-plugin'); // trasladar el css global al dist

const CssMinimizeWebPackPlugin= require('css-minimizer-webpack-plugin'); // minimizar el css global del dist

const CopyWebPackPlugin= require('copy-webpack-plugin'); //copiar carpetas estaticas al dist
module.exports={
    mode:'development',
    optimization: {
        minimizer: [
          new CssMinimizeWebPackPlugin(),
        ],
    },
    module: {
        rules: [

           
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
            filename: '[name].css',
            ignoreOrder: false,
        }),
        new CopyWebPackPlugin({
            patterns:[
                {from : 'src/assets' , to:'assets/'}
            ]
        })
    ] 
}