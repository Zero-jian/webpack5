const path = require("path");
const webpack = require("webpack");
// 加载热更新
const webpackDevServer = require("webpack-dev-server");
// html模板
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 复制文件夹
const copyWebpackPlugin = require("copy-webpack-plugin");
// 提取css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩js
const TerserPlugin = require("terser-webpack-plugin");
// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 清除dist
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    login: "./src/login.js",
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        // 处理css里面的图片
        test: /\.(jpg|png|jpeg|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: "images/[name].[hash:6][ext]",
        },
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "login.html",
      template: "./src/login.html",
      chunks: ["login"],
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/img"),
          to: path.resolve(__dirname, "./dist/img"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:6].css",
      chunkFilename: "css/[name].[hash:6].chunk.css",
    }),
    new CleanWebpackPlugin()
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 2888,
    hot: true,
  },
  optimization: {
    // 是否开启压缩
    minimize: true,
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    // 分割文件
    splitChunks: {
      chunks: "all",
      minSize: 30 * 1024,
      name: "common",
      cacheGroups: {
        jquery: {
          name: "jquery",
          chunks: "all",
          test: /jquery\.js/,
        },
      },
    },
  },
};
