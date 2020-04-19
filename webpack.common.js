
const path = require("path");
const webpack = require('webpack');
const pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
const phaser = path.join(pathToPhaser, "dist/phaser.js");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
      { test: /phaser\.js$/, loader: "expose-loader?Phaser" }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      phaser: phaser
    }
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new webpack.DefinePlugin({
      'process.env': {
        'PORT': JSON.stringify(process.env.PORT)
      }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'Alkito - Web 2D MMORPG',
        template: 'public/index.html',
        favicon: 'public/favicon.ico',
    }),
  ],
};