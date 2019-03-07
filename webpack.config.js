var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var VueLoaderPlugin = require('vue-loader/lib/plugin');

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'src/phaser.js');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
  entry: {
    game: ['babel-polyfill', path.resolve(__dirname, 'src/client/phaser')],
    player: ['babel-polyfill', path.resolve(__dirname, 'src/client/player')],
    vendor: ['phaser', 'webfontloader']
  },
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: '[name].js'
  },
  watch: true,
  plugins: [
    new VueLoaderPlugin(),
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' /* chunkName= */,
      filename: 'vendor.bundle.js' /* filename= */
    }),
    new HtmlWebpackPlugin({
      filename: 'game.html',
      template: './public/game.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json',
      chunks: ['vendor', 'game'],
      chunksSortMode: 'manual',
      hash: false
    }),
    new HtmlWebpackPlugin({
      filename: 'player.html',
      template: './public/player.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json',
      chunks: ['vendor', 'player'],
      chunksSortMode: 'manual',
      hash: false
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './dist']
      },
      ghostMode: false,
      target: 'http://localhost:8080',
      ws: true
    })
  ],
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('file-loader'),
        options: {
          name: '/assets/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      phaser: phaser
    }
  }
};
