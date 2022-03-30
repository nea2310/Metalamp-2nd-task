const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
 * css-loader - импортировать CSS-файлы
 * style-loader - поместить CSS-код в тег <style> (мы его не используем)
 * MiniCssExtractPlugin - извлечь CSS в отдельный файл
 * не исключаем node-modules, т.к. оттуда берутся файлы стилей плагинов
 * postcss-loader - инструмент пост-обработки CSS
 * postcss-preset-env - набор расширений для эмуляции функций из незаконченных черновиков CSS-спецификаций
 * cssnano — уменьшает размер CSS-кода, убирая пробелы и переписывая код в сжатой форме
 */
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
  // Set the mode to production
  mode: 'production',
  output: {
    filename: 'assets/js/[name].[contenthash].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),
  ],
  module: {
    //module.rules - все лоадеры
    rules: [
      {
        test: /\.css$/i,
        use: processCSS,
      },
      {
        test: /\.scss$/,
        use: [...processCSS, 'sass-loader',],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        }
      },
      /*преобразование JavaScript следующего поколения в современный JavaScript с помощью Babel.*/
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       //https://runebook.dev/ru/docs/babel/babel-preset-env/index
      //       presets: [['@babel/preset-env', { 'targets': '> 0.25%, not dead' }]],
      //       /*Использование кэша для избежания рекомпиляции при каждом запуске*/
      //       cacheDirectory: true,
      //     }
      //   }
      // },
    ]
  },
})



