var webpack = require('webpack');

module.exports = {
  // entry: './js/entry.js',
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server',
    './js/index.js' // Your appʼs entry point
  ],
  output: {
    path: __dirname + '/js/',
    filename: 'bundle.js',
    publicPath: '/js/'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ }    //exclude是指排除指定目录
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};