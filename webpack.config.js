const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
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
			},
			{
				test: /\.(scss)$/,
				use: [
				  {
					loader: 'style-loader'
				  },
				  {
					loader: 'css-loader'
				  },
				  {
					loader: 'postcss-loader',
					options: {
					  postcssOptions: {
						plugins: () => [
						  require('autoprefixer')
						]
					  }
					}
				  },
				  {
					loader: 'sass-loader'
				  }
				]
			  }
		],
	},
	watch: true,
}