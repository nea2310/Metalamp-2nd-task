const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const src = path.join(__dirname, '../src');
const dist = path.join(__dirname, '../dist');
const PAGES_DIR = path.join(src, 'pages/');
const PAGES = [];
fs.readdirSync(PAGES_DIR).forEach((file) => {
  PAGES.push(file.split('/', 2).join());
});

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

module.exports = {
  resolve: {
    alias: {
      '@': src,
      '@fav': `${src}/assets/favicons`,
      '@com': `${src}/components`,
      '@pag': `${src}/pages`,
      '@styles': `${src}/assets/styles`,
    },
  },

  devServer: {
    /* отслеживать изменения в .pug файлах, т.к. по умолчанию это не происходит -
    см. https://qna.habr.com/q/1039918 */
    watchFiles: [`${src}/**/**/*.pug`],
  },

  mode,
  entry: `${src}/index.js`,
  output: { path: dist },
  plugins: [
    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `${src}/pages/${page}/${page}.pug`,
      filename: `./${page}.html`,
      inject: true,
    })),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

    new ESLintPlugin(),

    /*  подход 2022г. по созданию фавиконов:
    * https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    * рекомендации HTML-академии:
    * https://habr.com/ru/company/htmlacademy/blog/578224/ */

    new CopyPlugin({
      patterns: [
        { from: `${src}/assets/favicons/favicons-main`, to: `${dist}` },
        { from: `${src}/assets/favicons/favicons-extra`, to: `${dist}/assets/favicons/` },
        { from: `${src}/assets/favicons/manifest`, to: `${dist}/assets/favicons/` },
      ],
    }),
    /* поле output обязательно д.б. заполнено, даже если берем значение по умолчанию { path: dist },
     иначе плагин выдаст ошибку options.output.path not defined. Plugin disabled */

    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // https://runebook.dev/ru/docs/babel/babel-preset-env/index
            presets: [['@babel/preset-env', { targets: '> 0.25%, not dead' }]],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
    ],
  },
};
