const webpack = require('webpack');

module.exports = {
    configureWebpack: (config) => {

        config.devtool = 'cheap-module';


        config.resolve.alias = {
            ...config.resolve.alias,
            ...{

                'vue$': 'vue/dist/vue.esm.js',
            }
        };

        const _def = new webpack.DefinePlugin({
            NODE_ENV: '"development"',
            __URL__: JSON.stringify('http://172.16.134.43/auth')
        })

        config.plugins.push(_def);

    },
    baseUrl: process.env.NODE_ENV === 'production'
    ? '/control/'
    : '/',
    css: {
        extract: true
    },
    devServer: {
        proxy: {
            '/auth/': {
                target: 'http://172.17.3.40',
                changeOrigin: true,
                pathRewrite: {
                    '^/auth': '/auth'
                }
            },
            '/sendSSOToken': {
                target: 'http://172.17.3.40',
                changeOrigin: true
            }
        },
        host: '0.0.0.0',
        port: 8080
    }
}