const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const path = require("path")

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, ""),
    libraryTarget: "commonjs2"
  },
  externals: {
    assets: "assets",
    scenegraph: "scenegraph",
    application: "application",
    commands: "commands",
    clipboard: "clipboard",
    cloud: "cloud",
    uxp: "uxp",
    viewport: "viewport",
    interactions: "interactions"
  },
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
  performance: { maxEntrypointSize: 10000000, maxAssetSize: 100000000 },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        parallel: true
      })
    ]
  }
}
