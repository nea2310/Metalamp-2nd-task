npm init  (в рабочем каталоге создаём файл  package.json)

package name: (webpackX)  - имя проекта будет названием можно так и оставить главное не называть проект webpack а то будет конфликт
version: (1.0.0) - можно оставить такой же.. 
description: - можно что нить написать.. к примеру обучение WebPack
entry point: (index.js) - пока оставляем по умолчанию
test command: - не нужно
git repository: - не нужно
keywords: js, javaScript, webPack  - можно и не писать
author: coder1 <c.o.d.e.r.1@mail.ru>
license: (ISC) - по умолчанию 
OK 

--------------------------------------------------------------------

установить npm i -D cross-env  - позволяет определить мы в режиме разработки 
 
 в файле package.json в объекте Скрипт прописываем свои команды:
 
 "scripts": {
  "dev": "cross-env NODE_ENV=webpack --mode development",  - собирать в режиме разработки
  "build": "cross-env NODE_ENV=webpack --mode production",  - в режиме продакшена (минифицированные файлы)
  "watch": "cross-env NODE_ENV=webpack --mode development --watch" - автопроверка на изменения и пересборка проекта
  "start": "cross-env NODE_ENV=webpack-dev-server --mode development --open"  - запуститься сервер который будет обнавлять окно в браузере, ключ опен позволит сразу открыть окно браузера
 }
  
  webpack-dev-server - все измененённые файлы на выходе хранит в оперативной памяти что бы быстро обнавлять окно в браузере
  если мы наберём команду npm run build то все наши файлы будут собраны в каталоге.. 
  webpack-dev-server - используеться только в режиме разработки
   
  
 В package.json можно заменить строку "main": "index.js"
 на "private": true - что бы он не был публичным
 
 теперь что бы собрать проект можно вводить команды: npm run dev или npm run build



--------------------------------------------------------------------
Устанавливаем WebPack

npm i -D webpack webpack-cli     - тут используеться флаг D - который указывает что нам нужны пакеты лишь для разработки, в других целях мы не используем Вебпак.. 
(что по идеи уменьшает количество загружаемых файлов - зачем нам то чего не будем использовать)

webpack - корневой функционал плагины

webpack-cli - работа с командной строкой (управление Вебпаком)

--------------------------------------------------------------------

В корне рабочего каталога создаём файл конфигурации для WebPack 

webpack.config.js  Код:


const path = require('path');   - доступ к основным адресам.

module.exports = {
mode: 'development',          - собираем проект в режиме разработки 
entry: './src/index.js',            - источник 

output: {                  - выходной результат
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'dist')    - __dirname корневой адрес проекта и папка в нём "dist" - туда всё и положить 
}

}



export default class Post - к примеру прописываем классу из одного файла js 

а в том файле где мы используем этот клас импортируем

import Post from './Post'    - в конце адрес откуда импортируем (файл... расширение писать не нужно)

--------------------------------------------------------------------

в консоли вводим команду npx webpack

--------------------------------------------------------------------

в entry можно передать объект с адресами к разным файлам

entry: {
main: './src/index.js',
analytics: './src/analytics.js'
},

output: {                  
  filename: filename('js'),    - добавить префикс с именем ключа из объекта 'entry'
  path: path.resolve(__dirname, 'dist')    
},

resolve: {
extensions: ['.js', '.json', '.png', '.xml', '.csv']    ----- расширения по умолчанию, можно будет не указывать в импорте файлов
alias:{
'@models': path.resolve(__dirname, 'src/models'),   --- укарачиваем пути в импортах..  будет выглядить так import Post from '@models/Post'
'@':path.resolve(__dirname, 'src')
}
},

optimization: optimization(),

devServer: {
 port: 4200
 hot: isDev
}



--------------------------------------------------------------------

Использование плагинов: 

 Установка.
 
 npm i -D html-webpack-plugin
 
 подключение плагина:
 
 
 
 в конфиг добавляем новую запись:
 
 
const HTMLWebpackPlugin = require('html-webpack-plugin') 
const path = require('path');   

module.exports = {
context: path.resolve(__dirname, 'src'),  - адресное пространство для entry
mode: 'development',         
entry: {
main: './index.js',
analytics: './analytics.js'
}         

output: {                  
  filename: filename('js'),   
  path: path.resolve(__dirname, 'dist')    
},
 plugins: [
 new HTMLWebpackPlugin({
 title: 'Загаловок HTML файла',
 template: './src/index.html'   -- указываем адрес к файлу с которым хотим работать 
 
 })
 
 ]

}
 
==============================

 npm i -D clean-webpack-plugin
 
 const {CleanWebpackPlugin} = require('clean-webpack-plugin')
 
 const CopyWebpackPlugin = require('copy-webpack-plugin')  -- плагин копирования 
 
 const isDev = process.env.NODE_ENV === 'development'  - переменная для проверки мы в режиме разработки или нет
 const isProd = !isDev
 
  plugins: [
 new HTMLWebpackPlugin({
 template: './index.html',   -- указываем адрес к файлу с которым хотим работать 
 minify: {
  collapseWhitespace: isProd
 }
 }),
 new CleanWebpackPlugin(),   - уберёт все неиспользуемые файлы в папке dist
 new CopyWebpackPlugin([
  { 
   from: path.resolve(__dirname, 'src/favicon.ico'),   --- что копируем
   to: path.resolve(__dirname, 'dist')  -- куда копируем
  }
 ])
 ]
 
 

 
--------------------------------------------------------------------
 
лоадеры (добавления функционала, для работы к примеру с другими типами файлов)
 
 в конфигураторе добавляем объект:
 
 module: {
 rules:[
   {
     test: /\.css$/,    - регулярное вырожение (если нам попадаються файлы соответсвующего типа то использовать следующеие лоадеры)
	 use: ['style-loader','css-loader']  - эти два пакета нужно устанавливать (чтение идёт с права на лево, css позволяет вебпаку делать импорты стилей в js и работать с ними а style добавляет наши описанные стили в секцию head в Html файле)
   }
 ]
 
 }
 
 Установка лоадеров:
 
 npm i -D style-loader css-loader
 
 
 в js файле пишем к примеру:
 
 import './styles/styles.css'
 
 можно подключить и Джейсон:
 
 import json from './assets/json'  - расширение файла джейсона указывать не обязательно, тип файла уже определён
 
 в переменной json - будет находиться код
 
--------------------------------------------------------------------

Работа с изображениями, шрифтами, XML-файлами, CSV:

  npm i -D file-loader
  
  
  module: {
 rules:[
   {
     test: /\.css$/,    - регулярное вырожение (если нам попадаються файлы соответсвующего типа то использовать следующеие лоадеры)
	 use: ['style-loader','css-loader']  - эти два пакета нужно устанавливать (чтение идёт с права на лево, css позволяет вебпаку делать импорты стилей в js и работать с ними а style добавляет наши описанные стили в секцию head в Html файле)
   },
   {
   test: /\.(png|jpg|svg|gif|webp)$/,
   use: ['file-loader']
   },
   {
   test: /\.(ttf|woff|woff2|eot)$/,
   use: ['file-loader']
   },
    {
   test: /\.xml$/,
   use: ['xml-loader']
   },
      {
   test: /\.csv$/,
   use: ['csv-loader']
   },
     {
   test: /\.js$/,
   exclude: /node_modules/,  - exclude говорит что из зоны поиска нужно исключить каталог node_modules потому что нам не нужно их компилировать
   loader: 'babel-loader',
   options: {
   presets: [
   '@babel/preset-env' 
   ],
plugins: [
  '@babel/plugin-proposal-class-properties'
]   
   }
   }
 ]
 
 }
 
 npm i -D xml-loader
 npm i -D csv-loader
 npm i -D papaparse   - необходим для CSV
 npm i --save-dev @babel/preset-env
 npm i --save @babel/polyfill 
 
 в package.json прописать ещё код 
 "browserslist": "> 0.25%, not dead",
 
 для подключения полифилов babel меняем код: 
 entry: {
main: ['@babel/polyfill','./index.js'],
analytics: './analytics.js'
}   
 
 плагин для бейбел:
 npm i -D @babel/plugin-proposal-class-properties 
 
 
 
 
 
 подключение: 
 
  import xml from './assets/data.xml'
  import csv from './assets/data.csv'
 
 
 npm i normalize.css - ну это по желанию не всегда нормолайз это хорошо. 
 
 в css эту библиотеку подключаем так:
 
 @import "~normalize.css";  - знак тильда в начале говорит о том что нужно перейти в каталог ноде_модулес
  
 
--------------------------------------------------------------------
 
Старонние библиотеки 

npm i -S jquery    -- S озночает что мы ставим как зависемость для нашего проекта и оно попадёт в поле dependencies
 
 подключение:
 
 import * as $ from 'jquery' - звёздочка говорит о том что всё будет помещено в переменную as .. пусть тут относительный будет искать в ноде модулес
 
-------------------------------------------------------------------- 
 
 Пакет для обнавления окна браузера при изменениях в коде:
 
 npm i -D webpack-dev-server
 
 
 
 Как хранить все стили в отдельном файле: 
 
 npm i --save-dev mini-css-extract-plugin
 
 const MiniCssExtractPlugin = require('mini-css-extract-plugin')
 
  {
     test: /\.css$/,    
	 use: ['style-loader','css-loader'] 
   }
 
  Заменить на:
  
   {
     test: /\.css$/,    
	 use: [{
	 loader: MiniCssExtractPlugin.loader,
	 options: {
	 hmr: isDev,
	 reloadAll: true
	 },
	 },'css-loader'] 
   }
 
 а также добавляем плагин
 
 new MiniCssExtractPlugin({
  filename: filename('css'), 
 })
 
-------------------------------------------------------------------- 

  npm i terser-webpack-plugin --save-dev
  
  npm i --save-dev optimize-css-assets-webpack-plugin
 
 const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
 const TerserWebpackPlugin = require('terser-webpack-plugin')

 
 
 
 const optimization = () =>{  -- функция оптимизации с проверкой ( в зависимости от сборки делать или не делать ).
 
 const config ={
 -- позволяет лишний код который используеться в нескольких js файлах вынести в один отдельный файл тем самым минимизируя основные.
 splitChunks: {    -- создаються файлы vendors
  chunks: 'all'
}
 }
 
 if(isProd)
 {
 config.minimizer = [
 new OptimizeCssAssetWebpackPlugin(),
 new TerserWebpackPlugin()
 ]
 }
 
 
 return config
 
 }
 
 -------------------------------------------------------------------- 
 
 
   {
     test: /\.scss$/,    
	 use: [{
	 loader: MiniCssExtractPlugin.loader,
	 options: {
	 hmr: isDev,
	 reloadAll: true
	 },
	 },
	 'css-loader',
	 'sass-loader'
	 ] 
   }
 
 
 npm i -D node-sass sass-loader
 
 
 
 импорт на scss файл то же надо сделать по стандарту... .
 
 
 const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`   -- если режим разработки то ext если продакшен то с хешем 
 
  -------------------------------------------------------------------- 
  babel - позволяет писать самый современный код на js при этом он его будет компилировать так что бы понимали все виды браузеров даже 
  если эти браузеры не поддерживают новый стандарт.... и это очень круто :)... 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
  -------------------------------------------------------------------- 
  
 После создания конфигурационного файла Вебпака, выписать все инсталлы столбиком и с комментариями
 затем все константы - описать где их пишут и зачем 
 и уже потом идёт разбор скрипта в конфигураторе... а не так всё в перемешку как у нас 
 
 
 
 Все плагины выписать в отдельно в одном месте и команды их установки
 так же как я делал это для галпа :)..  у каждого плагина ставить комментарий для чего он нужен.
 
 
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpack = require('webpack');
 
 
 
 
 
 2:43:00 – Динамические импорты
2:44:52 – Анализ финальной сборки
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

