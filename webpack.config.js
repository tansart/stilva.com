const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const autoprefixer = require('autoprefixer');

const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const CSS_MAPS = ENV !== 'production';

const devServerConfig = {
	host: '0.0.0.0',
	historyApiFallback: true,
	port: process.env.PORT || 8080,
	logLevel: 'debug'
};

module.exports = {
	mode: ENV,
	context: path.resolve(__dirname, "src"),

	entry: {
	  bundle: './index.js'
  },

	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: '/',
    chunkFilename: '[name].js',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['.jsx', '.js', '.scss'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		]
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				enforce: 'pre',
				use: 'source-map-loader'
			},
			{
        test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.(scss|css)$/,
				include: [
					path.resolve(__dirname, 'node_modules'),
					path.resolve(__dirname, 'src')
				],
				use: [
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {sourceMap: CSS_MAPS, importLoaders: 1, minimize: true}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: CSS_MAPS,
							plugins: () => {
								autoprefixer();
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {sourceMap: CSS_MAPS}
					}
				]
			}
		]
	},

	optimization: {
		minimizer: [prodOnly(
				new UglifyJsPlugin({
					uglifyOptions: {
						output: {
							beautify: false,
							comments: false
						},
						compress: {
							unsafe_comps: true,
							properties: true,
							keep_fargs: false,
							pure_getters: true,
							collapse_vars: true,
							unsafe: true,
							warnings: false,
							sequences: true,
							dead_code: true,
							drop_debugger: true,
							comparisons: true,
							conditionals: true,
							evaluate: true,
							booleans: true,
							loops: true,
							unused: true,
							hoist_funs: true,
							if_return: true,
							join_vars: true,
							drop_console: true
						}
					}
				})
		)]
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV),
			'__DEV__': JSON.stringify(ENV !== 'production')
		}),
		new MiniCssExtractPlugin({
			filename: 'styles.css',
			allChunks: true,
			// disable: ENV !== 'production'
		}),
		new HtmlWebpackPlugin({
			template: './index.ejs',
			templateParameters: {
				distPath: ENV === "production" ? "/dist" : null
			},
			minify: {collapseWhitespace: true}
		}),
		prodOnly(
				new BundleAnalyzerPlugin({
					analyzerMode: "disabled",
					generateStatsFile: true,
					openAnalyzer: false,
					statsFilename: "./stats-fe.json"
				})
		)
	],

	stats: {colors: true},

	devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		host: '0.0.0.0',
		historyApiFallback: true,
		port: process.env.PORT || 8080,
		proxy: {
			'/images': `http://${devServerConfig.host}:${devServerConfig.port}/dist`,
			'/videos': `http://${devServerConfig.host}:${devServerConfig.port}/dist`
		}
	}
};

function PluginProxy() {
	this.apply = _ => {};
}

function prodOnly(arr) {
	return ENV === "production" ? arr : new PluginProxy();
}
