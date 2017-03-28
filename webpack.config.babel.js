import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import path from 'path'
import V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin'

// const __MAIN = './main-regl.js'
const __MAIN = './p5-example.js'
// const __MAIN = './vanilla-canvas.js'

const ENV = process.env.NODE_ENV || 'development'
const _DEV_ = ENV === 'development'
const _STAGING_ = ENV === 'staging'

console.log(`Hello from webpack conf! Running for: ${ENV}`)

console.log('dudee', webpack.DefinePlugin)

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: __MAIN,

  devtool: _DEV_
    ? '#cheap-source-map'
    : _STAGING_
    ? '#source-map'
    : undefined,

  output: {
    path: path.resolve("./build"),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    modulesDirectories: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
      'node_modules',
    ],
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel?cacheDirectory=true',
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css`,
          `postcss`,
        ].join('!')),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw',
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: _DEV_ ? 'url' : 'file?name=[path][name]_[hash:base64:5].[ext]',
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw!glslify',
      },
    ],
  },

  postcss: () => [
    autoprefixer({ browsers: 'last 2 versions' }),
  ],

  plugins: ([
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
      disable: _DEV_,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
      'process.env.DEBUG': JSON.parse(JSON.stringify(process.env.DEBUG || false)),
      'process.browser': true,
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { collapseWhitespace: true },
    }),
  ]).concat(_DEV_ ? [
    new webpack.NamedModulesPlugin(),
  ] : [
    new V8LazyParseWebpackPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      sourceMap: _STAGING_,
    }),
  ]),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: true,
    __filename: false,
    __dirname: false,
    setImmediate: false,
  },

  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    colors: true,
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true,
    proxy: {},
  },
}
