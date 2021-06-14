


//--------------------------------------------------------------------------

const PATHS = require('./paths');
const FL = require('./filename');
const DP = require('./isDev');
const OPT = require('./optimization');

const { merge } = require('webpack-merge');
const devServ = require('./webpack.devServer.js');

module.exports = merge(devServ, {

	target: DP.isDev ? 'web' : 'browserslist',
	devtool: DP.isDev ? 'eval-cheap-module-source-map' : 'source-map', // показывает ошибки допущенные в файлах. (карта для браузеров) 


	entry: [
		"webpack/hot/dev-server",
		'./index.jsx', // входной файл (их может быть несколько)
	],

	context: PATHS.src, // корень исходников
	mode: 'development',   // собираем проект в режиме разработки
	output: {
		filename: FL.filename('js'),
		path: PATHS.dist, // каталог в который будет выгружаться сборка.
		//publicPath: '',
	},


	resolve: {
		extensions: ['.ts', '.jsx', '.tsx', '.css', '.js', '.scss'],  // когда мы прописываем тут расширения то при импуте в index.js их можно не прописывать 
		alias: {
			'@plugins': `${PATHS.src}\\plugins`,
			'@styles': `${PATHS.src}${PATHS.assets}styles`,
			'@typescript': `${PATHS.src}${PATHS.assets}ts`,
			'@': PATHS.src,
		}
	},


	optimization: OPT.optimization(), // минификация и оптимизация файлов на выходе  (если это Продакшен)

});