var path = require('path')
var webpack = require('webpack')

module.exports = {
  // Entry point for static analyzer
  entry: path.join(__dirname, 'public', 'js', 'app.js'),

  output: {
    // Where to build results
    path: path.join(__dirname, 'assets'),

    // Filename to use in HTML
    filename: 'bundle.js',

    // Path to use in HTML
    publicPath: '/'
  },

  resolve: {
    alias: {
      app: path.join(__dirname, 'public', 'js', 'app'),
      marionette: 'backbone.marionette',
      'sweet-alert': 'sweetalert',
      tpl: path.join(__dirname, 'public', 'js', 'tpl')
    }
  },

  plugins: [
    new webpack.ProvidePlugin({
      _: 'underscore',
      $: 'jquery',
      Backbone: 'backbone',
      jQuery: 'jquery'
    })
  ],

  module: {
    loaders: [
      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
      { test: /\.html$/, loaders: ['raw-loader'] },
      { test: /\.json$/, loaders: ['json-loader'] },
      { test: /\.png$/, loader: 'url-loader?limit=8192&mimetype=image/png' },
      { test: /\.jpe?g$/, loader: 'url-loader?limit=8192&mimetype=image/jpg' },
      { test: /\.gif$/, loader: 'url-loader?limit=8192&mimetype=image/gif' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=8192&mimetype=image/svg+xml' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=8192&mimetype=application/font-woff2' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=8192&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=8192&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' }
    ]
  },

  devtool: '#inline-source-map'
}
