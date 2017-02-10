const Webpack = require("webpack")
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require("./webpack.config")
const config = require('./config/')

// 自动刷新浏览器WDS和模块热替换HMR
webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:3000', "webpack/hot/dev-server");
webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());

var compiler = Webpack(webpackConfig)
var server = new WebpackDevServer(compiler, {
    publicPath: config.publicPath,           //当请求路径是这个的时候就是向webpack-dev-server发起请求否则会被代理
    hot:true,
    stats: {
        colors: true //显示不同的颜色区分打包的文件
    },
    proxy: { //代理服务器
        '*': {
            target: config.target,
            changeOrigin: true
        }
    }
})

server.listen(3000, (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('http://localhost:3000' + config.publicPath)
})