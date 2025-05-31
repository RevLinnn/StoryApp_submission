const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    port: 8080,
      hot: false,  
  liveReload: true,   
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    proxy: [
      {
        context: ['/v1'],
        target: 'https://story-api.dicoding.dev',
        changeOrigin: true,
        secure: true,
      },
    ],
  },
});
