const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const common = require('./webpack.config');

const src = path.join(__dirname, '../src');
const dist = path.join(__dirname, '../dist');

const processCSS = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'autoprefixer', {},
            'cssnano', {},
            'postcss-preset-env', {},
          ],
        ],
      },
    },
  },
];

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'assets/js/[name].[contenthash].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),

    /*  подход 2022г. по созданию фавиконов:
    * https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    * рекомендации HTML-академии:
    * https://habr.com/ru/company/htmlacademy/blog/578224/ */

    new CopyPlugin({
      patterns: [
        { from: `${src}/assets/favicons/favicon.ico`, to: `${dist}` },
        { from: `${src}/assets/favicons/`, to: `${dist}/assets/favicons/` },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: processCSS,
      },
      {
        test: /\.scss$/,
        use: [
          ...processCSS,
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                `${src}/assets/styles/glob.scss`,
              ],
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },
    ],
  },
});
