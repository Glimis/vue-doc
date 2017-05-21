var config = require('./webpack.base.config')

config.devtool = 'eval-source-map'


config.devServer = {
  noInfo: true,
  proxy: {
    '/api': {
        target: 'http://127.0.0.1:3001',
        secure: false,
        pathRewrite: {'^/api' : ''}
    }
  }
}

module.exports = config
