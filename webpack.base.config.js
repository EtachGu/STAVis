
const path = require('path');
const webpack = require('webpack');

// PostCSS控件
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');

module.exports = (options) => ({
    entry: options.entry,
    output: Object.assign({ // 编译到js/build.js中
        path: path.resolve(process.cwd(), 'build'),
        publicPath: '/',
    }, options.output), // 和开发传入的settings合并
    module: {
        loaders: [{
            // 通过Babel转译在某些特定位置的所有 .js 文件
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: options.babelQuery,
        }, {
            // 通过PostCSS和CSS-modules转译项目拥有的 .css 文件
            test: /\.css$/,
            exclude: /node_modules/,
            loader: options.cssLoaders,
        }, {
            test: /\.css$/,
            include: /node_modules/,
            loaders: ['style-loader', 'css-loader'],
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader',
        }, {
            test: /\.(jpg|png|gif)$/,
            loaders: [
                // 编译生成一个文件，并返回对应路径
                'file-loader', 
                // 将图片压缩
                'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
            ],
        }, {
            test: /\.html$/,
            loader: 'html-loader',
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }, {
            test: /\.(mp4|webm)$/,
            loader: 'url-loader?limit=10000',
        }],
    },
    plugins: options.plugins.concat([
        new webpack.ProvidePlugin({
            // 启动 fetch
            fetch: 'exports?self.fetch!whatwg-fetch',
        }),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ]),
    postcss: () => [
        postcssFocus(), // 补充:focus到每个:hover
        cssnext({ // 允许使用最新css特性
            browsers: ['last 2 versions', 'IE > 10'],
        }),
        postcssReporter({ // 编译出现问题时报出错误
            clearMessages: true,
        }),
    ],
    resolve: {
        modules: ['app', 'node_modules'],
        extensions: [
            '',
            '.js',
            '.jsx',
            '.react.js',
        ],
        packageMains: [
            'jsnext:main',
            'main',
        ],
    },
    devtool: options.devtool,
    target: 'web',
    stats: false,
    progress: true,
});