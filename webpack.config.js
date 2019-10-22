const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const babelConfig = require('./babel.config.js');

// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  mode: "development",
  // devtool: 'source-map',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'src/[name].[contentHash].bundle.js'
  },
  devServer: {
    contentBase: './public',
  },
  module: {
    rules: [
      // html loader
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      // sass loader
      {
        test: /\.scss$/i,
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // css loader 
      {
        test: /\.css$/i,
        // use: [MiniCssExtractPlugin.loader, 'css-loader'],
        use: ['style-loader', 'css-loader'],
      },
      // javascript loader
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      },
      // js workers
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      // image loader
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/assets/images',
              name: '[name].[ext]'
            }
          },
        ],
      },
      // font loader
      {
        test: /\.(woff|woff2|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/assets/fonts',
              name: '[name].[ext]'
            }
          },

        ],
      },
    ],
  },
  externals: {
    // lodash: '_'
  },
  plugins: [
    // new MonacoWebpackPlugin({
    //   languages: ["typescript", "javascript"],
    // }),
    new MiniCssExtractPlugin({ filename: 'assets/css/[name].[contentHash].css' }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      "$": 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'],
      title: 'Output Management'
    })
  ],

  optimization: {
    minimizer: [
      // new OptimizeCssAssetsPlugin(),
      // new TerserPlugin()
    ],
    runtimeChunk: {
      name: "main"
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/, // you may add "vendor.js" here if you want to
          name: "vendor",
          chunks: "initial",
          enforce: true
        }
      }
    }
  }
};