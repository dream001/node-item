'use strict'

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
config.entry.unshift('webpack-dev-server/client?http://localhost:8090', "webpack/hot/dev-server");  
//这里写的端口地址必须对应下面的监听地址，否则你能访问但是不能热替换了，因为长连接没有监听到你访问的端口，上面的地址表示的是你
//要watch的地址,下面的地址才是你要访问的地址
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// 这里配置：请求http://localhost:8090/api，
// 必须是和上面的一样的请求路径否则无法代理，publicPath是无法代理直接指向webpack-dev-server打包的内存的
// 相当于通过本地node服务代理请求到了http://cnodejs.org/api
var proxy = [{
    path: "/api/*",
    target: "https://cnodejs.org",
    host: "cnodejs.org"        //主机地址必须和上面一样
}]
//只有像下面这样写才可以做到代理,你在写的时候最好写最后你要的那个接口地址，然后代理到你写的测试服务器地址，或者你自己写个本地接口服务器，
//这样打包后直接就是发到最后的接口地址了
// var proxy = {
//     "/api/*":{
//     	target: "https://cnodejs.org",
//     	secure: false        
// 	}
// }
//启动服务
var app = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot:true,                                  
    //启用hot之后后台代码的改变只改变需要改的部分，不刷新浏览器，默认是false,改变重刷浏览器。对于vue来说实际上true的时候已经检测到改
    //变了都打包了已经，但是你要是改样式什么的它立马就改了，但是却无法渲染页面出来了还是得手动刷新浏览器，所以有时候还不如改为false,
    //但是如果你改入口文件它就会重刷整个页面了，因为基本上已经全部重新渲染挂载了
    historyApiFallback: true,
    proxy:proxy
});
app.listen(8090);


// 上面的proxy的配置也可这样写  
// proxy: {  
//     '/engineer/*': {  
//         target: 'http://dws.XXXXX.com',  
//         secure: false  
//     }  
// } 
// 那么当请求的url: 'http://localhost:8080/engineer/api/Order/GetOrderListByEngineer'
// 当然你也可以把localhost:8080去掉写绝对路径，这么配置之后，访问的请求实际上，被转发的地址为 'http://dws.XXXXX.com/engineer/api/Order/GetOrderListByEngineer'
// 一般前端框架比如" ExtJS "、" AngularJS ", 框架监测到访问的域名可能存在跨域的话会先发送一个 OPTIONS 请求，验证是否可进行通信，如果返回
// 可通信才会真正发起一个POST、GET请求,否则返回405错误，这也就是一开始设置$.ajaxSettings.crossDomain = true;的原因















