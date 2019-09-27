'use strict'
require('./check-versions')();

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming triffic
// 如果没用指定运行端口，使用 config.dev.port 作为运行端口
const port = process.env.PORT || config.dev.port

// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

// 启动 webpack-dev-middleware，将启动后的文件暂存到内存中
// const devMiddleware = require('webpack-dev-middleware')(compiler, {
//   publicPath: webpackConfig.output.publicPath,
//   quiet: true,
//   stats: {
//     colors: true,
//     chunks: false
//   }
// })

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// 启动 webpack-hot-middleware，也就是我们常说的 hot-reload
const hotMiddleware = require('webpack-hot-middleware')(compiler)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 使用 connect-history-api-fallback 匹配资源，如果不匹配就可以重定向到指定地址
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
// 拼接 static 文件夹的静态资源路径
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
const readyPromise = new Promise((resolve => {
  _resolve = resolve
}))

console.log('> Starting dev server ...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }

  _resolve
})

const server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
