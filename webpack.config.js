const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const src = path.join(__dirname, './src');
const PAGES_DIR = `${src}\\pages\\`;
const PAGES = [];
fs.readdirSync(PAGES_DIR).forEach((file) => {
  PAGES.push(file.split('/', 2).join());
});


let mode = 'development'
if (process.env.NODE_ENV === 'production') {
  mode = 'production'
}

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
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "autoprefixer", {},
            "cssnano", {},
            "postcss-preset-env", {},
          ],
        ],
      },
    },
  },
];


module.exports = {

  resolve: {
    alias: {
      '@com': `${src}/components`,
      '@pag': `${src}/pages`,
      '@styles': `${src}/assets/styles`,
    }
  },


  devServer: {
    /* отслеживать изменения в .pug файлах, т.к. по умолчанию это не происходит - 
    см. https://qna.habr.com/q/1039918*/
    watchFiles: ['src/**/**/*.pug'],
  },

  mode: mode,
  devtool: 'source-map',
  /*настройки директории выходного файла (бандла)*/
  output: {
    filename: 'assets/js/[name].[contenthash].js',
    assetModuleFilename: "assets/[hash][ext][query]",
    /*очищать dist перед очередным запуском npm run build или npm run dev*/
    clean: true,
  },
  /*В отличие от лоадеров, плагины позволяют выполнять задачи после сборки бандла. 
  Эти задачи могут касаться как самого бандла, так и другого кода*/
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),
    /*HtmlWebpackPlugin создает index.html в директории с бандлом и автоматически добавляет в него ссылку на бандл.
    HtmlWebpackPlugin создаст новый файл index.html в директории dist и добавит в него ссылку на бандл —
     <script src='main.js'></script> (или  <script src='main.[hash].js'></script>, если это build режим).
     Мы создаем html файл из каждого pug файла, поэтому обходим циклом массив с названиями всех pug-страниц и 
     для каждой создаем объект HtmlWebpackPlugin 
     */

    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `./src/pages/${page}/${page}.pug`,
      filename: `./${page}.html`,
      inject: true,
    })),
    //Подключение jquery
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

  ],
  module: {
    //module.rules - все лоадеры
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: processCSS,
      },

      /*преобразование JavaScript следующего поколения в современный JavaScript с помощью Babel.*/
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            //https://runebook.dev/ru/docs/babel/babel-preset-env/index
            presets: [["@babel/preset-env", { "targets": "> 0.25%, not dead" }]],
            /*Использование кэша для избежания рекомпиляции при каждом запуске*/
            cacheDirectory: true,
          }
        }
      },

      {
        test: /\.scss$/,
        use: [...processCSS, "sass-loader",],
      },

      /*asset/resource это аналог file-loader.
      Файлы, которые будут подпадать под правило с type: 'asset/resource',
       будут складываться в директорию с бандлом*/
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext]',
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][hash][ext]',
        }
      },
    ]
  },
}


