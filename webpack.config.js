const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.csv$/,
				use: [
					{
						loader: 'csv-loader',
						options: {
							dynamicTyping: true,
							header: true,
							skipEmptyLines: true
						}
					}
				]
			}
		]
	},
}