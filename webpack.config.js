const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');

if (!fs.existsSync("./dist")){
  fs.mkdirSync("./dist");
}

module.exports = {
  mode: "development",
  watchOptions: {
    aggregateTimeout: 600,
    ignored: [
      "**/files/**/*.js",
      "**/node_modules",
      "**/dist/**/*",
    ],
  },
  devtool: "inline-source-map",
  entry: {
    "background": path.resolve(__dirname, "./scripts/background/background.ts"),
    "content": path.resolve(__dirname, "./scripts/content/content.ts"),
    "options": path.resolve(__dirname, "./scripts/options/options.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        exclude: "/node_modules/",
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader", "resolve-url-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
      "timers": require.resolve("timers-browserify"),
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./icons/**/*", to: "./" },
        { from: "./assets/**/*", to: "./" },
        { from: "./options.html", to: "./" },
        { from: "./manifest.json", to: "./" },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
