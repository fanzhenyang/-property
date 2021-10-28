'use strict'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/styles/variable.scss";
          @import "@/styles/mixin.scss";
        `
      }
    }
  },
  devServer: {
    port: 9966,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/itps': {
        // target: 'http://192.168.116.134', // 本地
        // target: 'http://172.28.1.4', // 线上
        // target: 'http://125.75.36.111:81',
        target: 'http://172.26.1.102',
        // target: 'http://172.26.10.2',
        changeOrigin: true,
        pathRewrite: {
          '^/itps/': '/itps/'
        }
      }
    }
  },
  productionSourceMap: false,
  chainWebpack (config) {
    config.resolve.alias
      .set('@', resolve('src'))
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '铁路投资建设智慧管控平台'
        return args
      })
    config.module.rule('mjs$').test(/\.mjs$/).include
      .add(/node_modules/)
      .end()
      .type('javascript/auto')
  }
}
