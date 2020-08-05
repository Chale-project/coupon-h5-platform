const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          red: '#f44',
          blue: '#1989fa',
          orange: '#e9ca32',
          green: "#07c160",
          'text-color': '#333'
        },
      }
    }
  },

  devServer: {
    port: 8081, // 端口号
    https: false, //https:{type:Boolean}
    open: true, //配置自动启动浏览器
    proxy: {
      '/gateway': {
        target: 'http://192.168.0.109:9007',
        ws: false,
        changeOrigin: true,
        // pathRewrite: {
        //   '^/gateway': '/api'
        // }
      }
    }
  },

}