module.exports = {
	presets: [
	"@babel/env",
	"@babel/react",
	"@babel/preset-typescript"
	],
	plugins: [
		"@babel/plugin-proposal-private-methods",
		"@babel/plugin-proposal-class-properties",
		// "@babel/plugin-proposal-private-property-in-object",
		//"@babel/plugin-syntax-class-properties"
	]
};