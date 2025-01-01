const { name } = require('./package.json')
const path = require('path') //引入path模块
const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  runtimeCompiler: true,
  outputDir: 'dist/administrative',
  transpileDependencies: true,
  productionSourceMap: false, // 禁用生产环境的 Source Maps
  publicPath: process.env.NODE_ENV === 'production' ? '/administrative' : '/', //
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        assets: '@/assets',
        components: '@/components',
        views: '@/views',
        types: '@/types',
        common: '@/common',
      },
    },
    plugins: [new NodePolyfillPlugin()],
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      // jsonpFunction: `webpackJsonp_${packageName}`,
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'initial', // 只对初始加载的模块进行拆分
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
      minimize: true, // 确保在生产模式下开启压缩
      minimizer: [
        // 自定义 terser 配置
        (compiler) => {
          const TerserPlugin = require('terser-webpack-plugin')
          compiler.options.optimization.minimizer = [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: process.env.NODE_ENV === 'production', // 生产环境下移除 console.log
                },
              },
              parallel: true,
            }),
          ]
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
        additionalData: `@import "./node_modules/amber-design-vue/dist/style/themes/index.less";`,
      },
    },
  },
  devServer: {
    client: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    open: true, // 自动打开浏览器
    hot: true,
    proxy: {
      '/*': {
        changeOrigin: true, //是否开启跨域 ,不可注释
        ws: false, // 不可注释
        // /**
        //  * 非代理交投需要打开这段注释
        //  */
        // target: {
        // target: 'http://szdm.amberdata.cn/', // 接口地址
        // target : 'http://micro.amberdata.cn/',
        target: 'http://newmicro.amberdata.cn/',
      },
    },
  },
})
