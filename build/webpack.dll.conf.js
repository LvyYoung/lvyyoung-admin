'use strict'
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['vue/dist/vue.esm.js', 'vue', 'vue-router', 'vuex', 'jquery', 'webbase']
  },
  output: {
    path: path.join(__dirname, '../static/dll'),
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  performance: {
    hints: "warning",
    maxAssetSize: 30000000,
    maxEntrypointSize: 50000000,
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, '../static/dll', '[name]-mainfest.json')
    })
  ]
}
