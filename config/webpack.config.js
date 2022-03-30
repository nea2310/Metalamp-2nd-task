const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
//const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

const src = path.join(__dirname, '../src');
const dist = path.join(__dirname, '../dist');
const PAGES_DIR = `${src}\\pages\\`;
const PAGES = [];
fs.readdirSync(PAGES_DIR).forEach((file) => {
  PAGES.push(file.split('/', 2).join());
});


let mode = 'development'
if (process.env.NODE_ENV === 'production') {
  mode = 'production'
}

module.exports = {

  resolve: {
    alias: {
      '@fav': `${src}/assets/favicons`,
      '@com': `${src}/components`,
      '@pag': `${src}/pages`,
      '@styles': `${src}/assets/styles`,
    }
  },


  devServer: {
    /* отслеживать изменения в .pug файлах, т.к. по умолчанию это не происходит - 
    см. https://qna.habr.com/q/1039918*/
    watchFiles: [`${src}/**/**/*.pug`],
  },

  mode: mode,
  devtool: 'source-map',
  /*настройки точки входа*/
  entry: `${src}/index.js`,
  /*настройки директории выходного файла (бандла)*/
  output: {
    /*очищать dist перед очередным запуском npm run build или npm run dev*/
    clean: true,
  },
  /*В отличие от лоадеров, плагины позволяют выполнять задачи после сборки бандла. 
  Эти задачи могут касаться как самого бандла, так и другого кода*/
  plugins: [

    /*HtmlWebpackPlugin создает index.html в директории с бандлом и автоматически добавляет в него ссылку на бандл.
    HtmlWebpackPlugin создаст новый файл index.html в директории dist и добавит в него ссылку на бандл —
     <script src='main.js'></script> (или  <script src='main.[hash].js'></script>, если это build режим).
     Мы создаем html файл из каждого pug файла, поэтому обходим циклом массив с названиями всех pug-страниц и 
     для каждой создаем объект HtmlWebpackPlugin 
     */

    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `${src}/pages/${page}/${page}.pug`,
      filename: `./${page}.html`,
      inject: true,
    })),
    //Подключение jquery
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    new CopyPlugin({
      patterns: [
        { from: `${src}/assets/favicons/favicon.ico`, to: `${dist}` },
      ],
    }),

    // new FaviconsWebpackPlugin(
    //   {
    //     favicon: `${src}/assets/favicons/logo.png`
    //   }
    // ),

    /*подход 2022г. по созданию фавиконов:
    * https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
    
    * рекомендации HTML-академии:
    * https://habr.com/ru/company/htmlacademy/blog/578224/
    
    */
    new WebpackPwaManifest({
      name: 'TOXIN',
      icons: [
        { src: path.resolve(`${src}/assets/favicons/icon-192.png`), sizes: '192x192' },
        { src: path.resolve(`${src}/assets/favicons/icon-512.png`), sizes: '512x512' }
      ]
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
      /*преобразование JavaScript следующего поколения в современный JavaScript с помощью Babel.*/
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            //https://runebook.dev/ru/docs/babel/babel-preset-env/index
            presets: [['@babel/preset-env', { 'targets': '> 0.25%, not dead' }]],
            /*Использование кэша для избежания рекомпиляции при каждом запуске*/
            cacheDirectory: true,
          }
        }
      },
      /*asset/resource это аналог file-loader.
      Файлы, которые будут подпадать под правило с type: 'asset/resource',
       будут складываться в директорию с бандлом*/
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        }
      },
    ]
  },
}


