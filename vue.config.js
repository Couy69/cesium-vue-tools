const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const cesiumSource = './node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
// 后续 import 引入 cesium 为改路径下的
const cesiumBuild = './node_modules/cesium/Build/Cesium'

module.exports = {
    // 基本路径
    publicPath: "./",
    // 输出文件目录
    outputDir: "dist",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 5000,
        https: false,
        hotOnly: false,
        disableHostCheck: true

    },

    configureWebpack: {
        output: {
            sourcePrefix: ' '
        },
        amd: {
            toUrlUndefined: true
        },
        node: {
            // Resolve node module use of fs
            fs: "empty"
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                'cesium': path.resolve(__dirname, cesiumBuild)
            }
        },
        plugins: [
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, '../Build/Cesium/ThirdParty'), to: 'ThirdParty' }]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./')
            })

        ],
        module: {
            unknownContextCritical: false
        }
    }
};