const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // mode: "production",
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/env', { targets: 'defaults' }],
              ['@babel/react'],
            ],
          },
        }, //
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|cur)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html',
      publicPath: '/',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: false,
    },

    static: {
      publicPath: '/build',
      directory: path.join(__dirname, 'build'),
    },
    proxy: { '/**': 'http://localhost:3000' }, //added this to do postman requests
    port: 8080,
  },
};