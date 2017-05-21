var path = require("path")
module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    publicPath: 'dist/',
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
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  vue: {
    loaders: {
      js: 'babel',
      sass:'css!sass',
      less:'style-loader!css-loader!less-loader'
    }
  },
  resolve: {
      alias: {
          common: path.join(__dirname, "../src/common")
      }   
  }
}
