const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config/')
const IS_ENV = process.env.NODE_ENV == 'production'


var plugins = []
if (IS_ENV) { //生产环境
    plugins.push(new webpack.DefinePlugin({ 
        'process.env': { //设置成生产环境
            NODE_ENV: 'production'
        }
    }))
    plugins.push(new webpack.optimize.UglifyJsPlugin({ //压缩代码
        compress: {
            warnings: false
        }
    }))
}

plugins.push(
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML,即下面打包后的js文件会自动以script标签的形式引入
        filename: './index.html', //生成的html存放路径，这个路径是相对于 path
        template: './src/template/index.html', //html模板路径
    })
    // 可以多new几个这样的东西来生成多个文件
    // new HtmlWebpackPlugin({  
    //   filename: 'test.html',
    //   template: 'src/assets/test.html'
    // })
)


module.exports = {
    entry: ['./src/main.js'], //编译入口文件
    output: {
        publicPath: config.publicPath, //服务器的路径
        path: path.resolve(__dirname + config.publicPath), //编译到app目录
        filename: '[name].bundle.js' ,//编译后的文件名,对应有四个页面文件，所以除了会打包出main.js文件还会打出1.1.js 2.2.js 3.3.js 4.4.js
        chunkFilename: "[id].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js(x)*$/,
                exclude: /^node_modules$/,
                loader: 'babel'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.css/,
                exclude: /^node_modules$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less/,
                exclude: /^node_modules$/,
                loader: `style-loader!css-loader!autoprefixer-loader?{
                    browsers: [
                        'ie >= 8',
                        'ie_mob >= 10',
                        'ff >= 26',
                        'chrome >= 30',
                        'safari >= 6',
                        'opera >= 23',
                        'ios >= 5',
                        'android >= 2.3',
                        'bb >= 10'
                    ]
                }!less-loader`
            },
            {
                test: /\.(png|jpg)$/,
                exclude: /^node_modules$/,
                loader: 'url?limit=2000&name=[name].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                exclude: /^node_modules$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    plugins,
    resolve: {
        extensions: ['', '.js', '.vue', '.jsx'], //后缀名自动补全
        alias: {
            vue: 'vue/dist/vue.js' //webpack打包时，需要设置别名
        }
    },
}