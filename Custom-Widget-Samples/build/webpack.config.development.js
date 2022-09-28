const path = require('path')

const base = require('./webpack.config.base')
module.exports = {
  ...base,
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 9000
  }
}
