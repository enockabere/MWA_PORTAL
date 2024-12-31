const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./frontend/src/index.js", // Entry point for your React code
  output: {
    path: path.resolve(__dirname, "frontend/static/frontend"), // Output directory for bundle.js
    filename: "bundle.js", // Name of the output file
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Test for .js files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Use these Babel presets
          },
        },
      },
      {
        test: /\.css$/, // For handling CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/, // Add this rule for SCSS files
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader",   // Translates CSS into CommonJS
          "sass-loader",  // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/img/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Resolve these file types
  },
  mode: "development", // You can switch to 'production' for production builds
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "frontend/static"),
          to: path.resolve(__dirname, "frontend/dist/static"), // Change the destination folder
          globOptions: {
            ignore: [
              "**/frontend/static/frontend/**", // Ignore the folder you're outputting to
            ],
          },
        },
      ],
    }),
  ],
};
