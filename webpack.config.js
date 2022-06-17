const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

const PUBLIC_PATH = path.resolve(__dirname, 'dist')

const htmlWebpackPluginDefaults = {
  scriptLoading: 'blocking',
  inject: 'head'
}

const pages = ['index.html', 'ui.html']
const dialogs = ['dialog-large.html', 'dialog-middle.html', 'dialog-small.html']

module.exports = {
  entry: './src/index.js',
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/')

    }
  },
  output: {
    path: PUBLIC_PATH,
    filename: 'index.js',
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
      { test: /\.s[ac]ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "css/style.css", }),
    ...pages.map((name) =>
      new HtmlWebpackPlugin({
        ...htmlWebpackPluginDefaults,
        template: `./src/${name}`,
        filename: name
      })
    ),
    new CopyPlugin({
      patterns: [
        { from: "./src/img/", to: "./img/" },
        ...dialogs.map((name) => ({ from: `./src/${name}`, to: `./${name}` }))
      ],
    }),
  ],
  devServer: {
    contentBase: PUBLIC_PATH,
    compress: false,
    port: 9000,
    historyApiFallback: true,

  },

};
