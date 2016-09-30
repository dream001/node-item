var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    path: '/dist',
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'     
          //loader: "url-loader?name=img/[hash:8].[name].[ext]",也可一起写并加上生成地址，在webpack-dev-server命令时候是在publicpath/img/下生成，
          //没写就直接在publicpath/下，当用webpack命令时候则生成在path下
        }
      },
      {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?[hash]&mimetype=application/font-woff'
          }
      },
      {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?[hash]&mimetype=application/font-woff2'
          }
      },
      {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?mimetype=application/font-woff2'
          }
      },
      {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?mimetype=application/font-woff2'
          }
      },
      {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?mimetype=image/svg+xml'
          }
      },
      {
          test: /\.json(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?mimetype=application/json'
          }
      }
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,  
      //           loader: 'style-loader!css-loader' 
      //   // loader: ExtractTextPlugin.extract(
      //   //   ["style-loader","css-loader?sourceMap"],
      //   //   {
      //   //     publicPath: "../dist/"
      //   //   }
      //   // )
      // },
    ]
  },
  vue: {
        loaders: {
            css: ExtractTextPlugin.extract(
              "style-loader",
              "css-loader?sourceMap",
              {
                publicPath: "../dist/"
              }
            )
        }
  },
  plugins: [
      new ExtractTextPlugin("style.css")     //分离CSS和JS文件  
  ],
  // 也可以这样写
  // let extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
  // let extractLESS = new ExtractTextPlugin('stylesheets/[name].less');
  // module: {
  //     loaders: [
  //       { test: /\.scss$/i, loader: extractCSS.extract(['css','sass']) },    第一个参数是加载loader以数组形式或者逗号隔开，之后是一个对象里面是配置地址
  //       { test: /\.less$/i, loader: extractLESS.extract(['css','less']) },
  //       ...
  //     ]
  //   },
  // plugins: [
  //     extractCSS,
  //     extractLESS
  //   ]
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}
