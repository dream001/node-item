'use strict'

var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var isProduction = function() {
    return process.env.NODE_ENV === 'production';
}

//webpack插件
var plugins = [
    //提公用js到common.js文件中
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    //将样式统一发布到style.css中,要结合下面的ExtractTextPlugin.extract方法一起使用，这里下面的配置表示对.css文件和.scss文件进行提取
    // 内嵌在模块中的样式不再提取，注意这里所有的样式文件的引入都在views/index.vue文件中引入的
    // new ExtractTextPlugin("[name].css")   表示每一个引入的外联样式文件都会不采取内联形式而是以link形式引入
    // 对于自己模块内些的style内嵌标签实际上是不使用该加载器的而是使用node-sass模块自动加载的
    new ExtractTextPlugin("style.css", {
        allChunks: true,      //表示对所有的打包文件进行样式提取合并默认false
        disable: false        //表示不禁用插件默认是false，改为true的话就不能用加载器了就不能打包了
    }),
    // 使用 ProvidePlugin 加载使用率高的依赖库
    new webpack.ProvidePlugin({
      $: 'webpack-zepto'
    })
];
var entry = ['./src/main'],
    cdnPrefix = "",
    buildPath = "/dist/",
    publishPath = cdnPrefix + buildPath;
//生产环境js压缩和图片cdn
if (isProduction()) {
    //plugins.push(new webpack.optimize.UglifyJsPlugin());
    cdnPrefix = "";
    publishPath = cdnPrefix;
}
//编译输出路径
module.exports = {
    debug: true,
    entry: entry,
    output: {
        path: __dirname + buildPath,
        filename: 'build.js',
        publicPath: publishPath,  //所有生成的图片路径还是引入路径什么的都是以这个地址为准
        // filename: '[name].build.js',
        chunkFilename:"[id].build.js?[chunkhash]"
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader',
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(
                "style-loader", 'css-loader?sourceMap!sass-loader!cssnext-loader')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                "style-loader", "css-loader?sourceMap!cssnext-loader")     
            //第一个参数是经过编译后通过style-loader单独提取出文件来，而第二个参数就是用来编译代码的loader
            //nextCSS是css的转译器,根据目前仍处于草案阶段、未被浏览器实现的标准把代码转译成符合目前浏览器实现的CSS
            // 类似 ES6 的 Babel。转译时因为也要处理前缀问题，所以直接依赖了 Autoprefixer 来做这个部分
        }, {
            test: /\.js$/,
            exclude: /node_modules|vue\/dist/,
            loader: 'babel'
        },{
            test: /\.(jpg|png|gif)$/,
            loader: "file-loader?name=images/[hash].[ext]"          //写下打包位置和名字了已经
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }]
    },
    // 使用babel的时候，要配置一下，否则在.babelrc文件里面配置也行
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extension: ['', '.js'],
        //别名
        alias: {
            filter: path.join(__dirname, 'src/filters')
        }
    },
    plugins: plugins,
    // devtool: '#source-map'
};
