const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: { main: './public/js/app.js' },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    //the name of the outputed file will be.
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin('public/dist', {}),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
};
