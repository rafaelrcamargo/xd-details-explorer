const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const webpack = require("webpack")
const path = require("path")

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/main.ts",
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^(uxp)$/u })],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        parallel: true
      })
    ]
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "")
  }
}
